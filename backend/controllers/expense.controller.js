const {
  sequelize,
  Expense,
  ExpenseApproval,
  User,
  Company,
} = require("../models");
const { buildApprovalChain } = require("../services/expense.service");
const { parseReceipt } = require("../utils/ocr");
const { convert } = require("../utils/currency");

/**
 * POST /api/expenses
 *
 * Creates a new expense and automatically generates the approval chain
 * based on the company's configured WorkflowSteps.
 *
 * Flow:
 *  1. Look up the submitter (need full User record for manager_id & company_id)
 *  2. Create the Expense
 *  3. Build the approval chain (WorkflowStep → ExpenseApproval records)
 *  4. Return expense + approval chain
 *
 * Everything runs inside a single transaction — if any step fails,
 * nothing is committed.
 */
exports.createExpense = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { amount, currency, category, description, date } = req.body;

    // ── 1. Fetch the full submitter record ──────────────────────────
    const submitter = await User.findByPk(req.user.id, { transaction });

    if (!submitter) {
      await transaction.rollback();
      return res.status(404).json({ error: "Submitter user not found." });
    }

    // ── 2. Create the expense ───────────────────────────────────────
    const expense = await Expense.create(
      {
        user_id: submitter.id,
        amount,
        original_currency: currency,
        converted_amount: amount, // TODO: integrate currency conversion
        category,
        description,
        date,
        status: "PENDING",
      },
      { transaction }
    );

    // ── 3. Build the approval chain ─────────────────────────────────
    const approvals = await buildApprovalChain(
      expense.id,
      submitter,
      transaction
    );

    // ── 4. Commit ───────────────────────────────────────────────────
    await transaction.commit();

    // ── 5. Return the full picture ──────────────────────────────────
    const result = await Expense.findByPk(expense.id, {
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
          order: [["step_order", "ASC"]],
        },
        {
          model: User,
          as: "submitter",
          attributes: ["id", "name", "email", "role"],
        },
      ],
    });

    return res.status(201).json({
      message: "Expense created with approval chain.",
      expense: result,
    });
  } catch (err) {
    await transaction.rollback();

    // Surface friendly messages for known business-rule violations
    const isBusinessError =
      err.message.includes("No workflow steps") ||
      err.message.includes("No active user with role") ||
      err.message.includes("has no manager assigned");

    return res.status(isBusinessError ? 422 : 500).json({
      error: err.message,
    });
  }
};

/**
 * GET /api/expenses/my
 *
 * Returns all expenses for the currently authenticated user,
 * along with their approval chain details.
 */
exports.getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: ExpenseApproval, as: "approvals" }, "step_order", "ASC"],
      ],
    });

    return res.json(expenses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/expenses/:id
 *
 * Returns a single expense with its full approval chain.
 */
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
        {
          model: User,
          as: "submitter",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [
        [{ model: ExpenseApproval, as: "approvals" }, "step_order", "ASC"],
      ],
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    return res.json(expense);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/expenses/pending-approvals
 *
 * Returns all expenses where the authenticated user is the approver
 * for the currently active step.
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const approvals = await ExpenseApproval.findAll({
      where: {
        approver_id: req.user.id,
        is_active: true,
        status: "PENDING",
      },
      include: [
        {
          model: Expense,
          include: [
            {
              model: User,
              as: "submitter",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.json(approvals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/expenses/:id/approve
 *
 * Approves the current active step for an expense.
 * If all steps are approved → marks the expense as APPROVED.
 * If more steps remain → activates the next step.
 */
exports.approveExpense = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { comments } = req.body;
    const expenseId = req.params.id;

    // Find the active approval step assigned to this user
    const approval = await ExpenseApproval.findOne({
      where: {
        expense_id: expenseId,
        approver_id: req.user.id,
        is_active: true,
        status: "PENDING",
      },
      transaction,
    });

    if (!approval) {
      await transaction.rollback();
      return res.status(403).json({
        error: "No active approval step found for you on this expense.",
      });
    }

    // Mark this step as approved
    approval.status = "APPROVED";
    approval.comments = comments || null;
    approval.acted_at = new Date();
    approval.is_active = false;
    await approval.save({ transaction });

    // Check if there are more steps
    const nextStep = await ExpenseApproval.findOne({
      where: {
        expense_id: expenseId,
        step_order: approval.step_order + 1,
      },
      transaction,
    });

    if (nextStep) {
      // Activate the next step
      nextStep.is_active = true;
      await nextStep.save({ transaction });
    } else {
      // All steps approved → mark expense as APPROVED
      await Expense.update(
        { status: "APPROVED" },
        { where: { id: expenseId }, transaction }
      );
    }

    await transaction.commit();

    // Return updated expense
    const updatedExpense = await Expense.findByPk(expenseId, {
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [
        [{ model: ExpenseApproval, as: "approvals" }, "step_order", "ASC"],
      ],
    });

    return res.json({
      message: nextStep
        ? "Step approved. Forwarded to next approver."
        : "Expense fully approved.",
      expense: updatedExpense,
    });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/expenses/:id/reject
 *
 * Rejects the expense at the current step.
 * The entire expense is marked REJECTED immediately.
 */
exports.rejectExpense = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { comments } = req.body;
    const expenseId = req.params.id;

    const approval = await ExpenseApproval.findOne({
      where: {
        expense_id: expenseId,
        approver_id: req.user.id,
        is_active: true,
        status: "PENDING",
      },
      transaction,
    });

    if (!approval) {
      await transaction.rollback();
      return res.status(403).json({
        error: "No active approval step found for you on this expense.",
      });
    }

    // Mark this step as rejected
    approval.status = "REJECTED";
    approval.comments = comments || null;
    approval.acted_at = new Date();
    approval.is_active = false;
    await approval.save({ transaction });

    // Immediately reject the entire expense
    await Expense.update(
      { status: "REJECTED" },
      { where: { id: expenseId }, transaction }
    );

    await transaction.commit();

    const updatedExpense = await Expense.findByPk(expenseId, {
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
      order: [
        [{ model: ExpenseApproval, as: "approvals" }, "step_order", "ASC"],
      ],
    });

    return res.json({
      message: "Expense rejected.",
      expense: updatedExpense,
    });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/expenses/all
 * Admin-only: Returns all expenses for the company.
 */
exports.getAllExpenses = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admins can view all expenses." });
    }

    const expenses = await Expense.findAll({
      include: [
        {
          model: ExpenseApproval,
          as: "approvals",
          include: [
            {
              model: User,
              as: "approver",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
        {
          model: User,
          as: "submitter",
          attributes: ["id", "name", "email", "role"],
          where: { company_id: req.user.company_id }
        },
      ],
      order: [
        ["createdAt", "DESC"],
        [{ model: ExpenseApproval, as: "approvals" }, "step_order", "ASC"],
      ],
    });

    return res.json(expenses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/expenses/ocr
 * Real OCR — upload receipt, extract fields, detect currency, convert to company currency.
 */
exports.processOcrReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Receipt image is required." });
    }

    const path = require("path");
    // absolute path to the uploaded file
    const filePath = path.resolve(req.file.destination, req.file.filename);

    const parsed = await parseReceipt(filePath);

    // Look up the company's base currency
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company }],
    });
    
    // Fallback if not set
    const companyCurrency = user.Company?.currency || "USD";

    const receiptCurrency = parsed.detectedCurrency || "USD";
    if (receiptCurrency !== companyCurrency && parsed.amount > 0) {
      try {
        const { converted, rate } = await convert(
          parsed.amount,
          receiptCurrency,
          companyCurrency
        );
        parsed.originalAmount = parsed.amount;
        parsed.originalCurrency = receiptCurrency;
        parsed.convertedAmount = converted;
        parsed.companyCurrency = companyCurrency;
        parsed.exchangeRate = rate;
        parsed.amount = converted; // Set the form amount to the converted value

        console.log(`💱 Converted ${receiptCurrency} ${parsed.originalAmount} -> ${companyCurrency} ${converted} at rate ${rate}`);
      } catch (convErr) {
        console.error("Currency conversion error:", convErr.message);
        parsed.originalAmount = parsed.amount;
        parsed.originalCurrency = receiptCurrency;
        parsed.companyCurrency = companyCurrency;
      }
    } else {
      parsed.companyCurrency = companyCurrency;
      parsed.originalCurrency = receiptCurrency;
      parsed.originalAmount = parsed.amount;
    }

    return res.json({ parsed });
  } catch (err) {
    console.error("OCR error in controller:", err);
    return res.status(500).json({ error: err.message || "OCR parsing failed" });
  }
};
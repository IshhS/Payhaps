const { WorkflowStep, ExpenseApproval, User } = require("../models");

/**
 * Resolves the approver for a given workflow step.
 *
 * - If is_manager_approver = true → returns the submitter's manager
 * - Otherwise → finds a user in the same company with the matching role
 *
 * @param {Object}  step       - WorkflowStep instance
 * @param {Object}  submitter  - User instance (the employee submitting the expense)
 * @returns {Promise<number|null>} approver user ID, or null if none found
 */
async function resolveApprover(step, submitter) {
  // ── Manager-based approval ──────────────────────────────────────
  if (step.is_manager_approver) {
    if (!submitter.manager_id) {
      throw new Error(
        `Workflow requires manager approval, but user "${submitter.name}" (ID: ${submitter.id}) has no manager assigned.`
      );
    }
    return submitter.manager_id;
  }

  // ── Role-based approval (FINANCE, DIRECTOR, etc.) ──────────────
  const approver = await User.findOne({
    where: {
      company_id: submitter.company_id,
      role: step.role,
      status: "ACTIVE",
    },
    order: [["id", "ASC"]], // deterministic: always picks the first matching user
  });

  if (!approver) {
    throw new Error(
      `No active user with role "${step.role}" found in company ID ${submitter.company_id}. ` +
      `Cannot create approval chain.`
    );
  }

  return approver.id;
}

/**
 * Builds the full approval chain for a newly created expense.
 *
 * 1. Fetches all WorkflowSteps for the submitter's company (ordered by step_order)
 * 2. Resolves each step's approver dynamically
 * 3. Bulk-inserts ExpenseApproval records
 * 4. Only the first step is marked as `is_active = true`
 *
 * Runs inside the provided Sequelize transaction for atomicity.
 *
 * @param {number}  expenseId   - ID of the newly created expense
 * @param {Object}  submitter   - Full User instance of the submitter
 * @param {Object}  transaction - Sequelize transaction
 * @returns {Promise<ExpenseApproval[]>} created approval records
 */
async function buildApprovalChain(expenseId, submitter, transaction) {
  // ── 1. Fetch workflow steps for this company ────────────────────
  const steps = await WorkflowStep.findAll({
    where: { company_id: submitter.company_id },
    order: [["step_order", "ASC"]],
    transaction,
  });

  if (steps.length === 0) {
    throw new Error(
      `No workflow steps configured for company ID ${submitter.company_id}. ` +
      `Please ask an admin to set up the approval workflow.`
    );
  }

  // ── 2. Resolve approvers for each step ──────────────────────────
  const approvalRecords = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const approverId = await resolveApprover(step, submitter);

    approvalRecords.push({
      expense_id: expenseId,
      approver_id: approverId,
      step_order: step.step_order,
      status: "PENDING",
      is_active: i === 0, // only the first step is active
    });
  }

  // ── 3. Bulk insert for performance ──────────────────────────────
  const approvals = await ExpenseApproval.bulkCreate(approvalRecords, {
    transaction,
  });

  return approvals;
}

module.exports = {
  resolveApprover,
  buildApprovalChain,
};

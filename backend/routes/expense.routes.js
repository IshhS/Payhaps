const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const auth = require("../middlewares/auth.middleware");

// ── Employee routes ─────────────────────────────────────────────
router.post("/", auth, expenseController.createExpense);
router.get("/my", auth, expenseController.getMyExpenses);

// ── Approver routes ─────────────────────────────────────────────
router.get("/pending-approvals", auth, expenseController.getPendingApprovals);
router.post("/:id/approve", auth, expenseController.approveExpense);
router.post("/:id/reject", auth, expenseController.rejectExpense);

// ── Shared routes ───────────────────────────────────────────────
router.get("/all", auth, expenseController.getAllExpenses);
router.get("/:id", auth, expenseController.getExpenseById);

module.exports = router;
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, expenseController.createExpense);
router.get("/my", auth, expenseController.getMyExpenses);

module.exports = router;
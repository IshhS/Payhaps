const { Expense } = require("../models");

exports.createExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    const expense = await Expense.create({
      user_id: req.user.id,
      amount,
      original_currency: currency,
      converted_amount: amount, // later convert
      category,
      description,
      date,
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyExpenses = async (req, res) => {
  const expenses = await Expense.findAll({
    where: { user_id: req.user.id },
  });

  res.json(expenses);
};
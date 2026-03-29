const sequelize = require("../config/db");

const Company = require("./company.model")(sequelize);
const User = require("./user.model")(sequelize);
const Expense = require("./expense.model")(sequelize);
const WorkflowStep = require("./workflowStep.model")(sequelize);
const ExpenseApproval = require("./expenseApproval.model")(sequelize);

// ── Company ↔ User ──────────────────────────────────────────────
Company.hasMany(User, { foreignKey: "company_id" });
User.belongsTo(Company, { foreignKey: "company_id" });

// ── Company ↔ WorkflowStep ──────────────────────────────────────
Company.hasMany(WorkflowStep, { foreignKey: "company_id" });
WorkflowStep.belongsTo(Company, { foreignKey: "company_id" });

// ── User ↔ Expense ─────────────────────────────────────────────
User.hasMany(Expense, { foreignKey: "user_id" });
Expense.belongsTo(User, { foreignKey: "user_id", as: "submitter" });

// ── Expense ↔ ExpenseApproval ───────────────────────────────────
Expense.hasMany(ExpenseApproval, { foreignKey: "expense_id", as: "approvals" });
ExpenseApproval.belongsTo(Expense, { foreignKey: "expense_id" });

// ── User ↔ ExpenseApproval (approver) ───────────────────────────
User.hasMany(ExpenseApproval, { foreignKey: "approver_id", as: "assignedApprovals" });
ExpenseApproval.belongsTo(User, { foreignKey: "approver_id", as: "approver" });

// ── Manager self-reference ──────────────────────────────────────
User.belongsTo(User, { as: "manager", foreignKey: "manager_id" });
User.hasMany(User, { as: "subordinates", foreignKey: "manager_id" });

module.exports = {
  sequelize,
  Company,
  User,
  Expense,
  WorkflowStep,
  ExpenseApproval,
};
const sequelize = require("../config/db");

const Company = require("./company.model")(sequelize);
const User = require("./user.model")(sequelize);
const Expense = require("./expense.model")(sequelize);

// Relationships
Company.hasMany(User, { foreignKey: "company_id" });
User.belongsTo(Company, { foreignKey: "company_id" });

User.hasMany(Expense, { foreignKey: "user_id" });
Expense.belongsTo(User, { foreignKey: "user_id" });

// Manager relationship
User.belongsTo(User, { as: "manager", foreignKey: "manager_id" });

module.exports = {
  sequelize,
  Company,
  User,
  Expense,
};
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Expense", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: DataTypes.FLOAT,
    original_currency: DataTypes.STRING,
    converted_amount: DataTypes.FLOAT,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
  });
};
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("ExpenseApproval", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    approver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    step_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Only the current step in the chain is active",
    },

    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    acted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp when the approver acted on this step",
    },
  });
};
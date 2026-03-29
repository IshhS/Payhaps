const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("WorkflowStep", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    step_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("MANAGER", "FINANCE", "DIRECTOR"),
      allowNull: false,
    },

    is_manager_approver: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
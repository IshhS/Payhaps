const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true, // important for invite flow
    },

    role: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "EMPLOYEE", "FINANCE" , "DIRECTOR"),
      defaultValue: "EMPLOYEE",
    },

    status: {
      type: DataTypes.ENUM("PENDING", "ACTIVE"),
      defaultValue: "PENDING",
    },

    invite_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};
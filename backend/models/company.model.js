const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Company", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    currency: DataTypes.STRING,
  });
};
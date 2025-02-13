const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Expense = sequelize.define('expense', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false},
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false}
});

module.exports = Expense;

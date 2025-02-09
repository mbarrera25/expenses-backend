const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Transaction = sequelize.define('transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false},
  description: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false},
  type_transaction: { type: DataTypes.STRING, allowNull: false},
  currency: { type: DataTypes.STRING, allowNull: false}
});

module.exports = Transaction;

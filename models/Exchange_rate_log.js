const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta a tu configuración de Sequelize

const ExchangeRateLog = sequelize.define('exchange_rate_log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = ExchangeRateLog;

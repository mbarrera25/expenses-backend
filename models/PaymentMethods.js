const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const PaymentMethods = sequelize.define('payment_methods', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = PaymentMethods;
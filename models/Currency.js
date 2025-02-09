const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Currency = sequelize.define('currency', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    symbol: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Currency;
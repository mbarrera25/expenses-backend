const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Types = sequelize.define('types', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});
module.exports = Types;
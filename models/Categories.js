const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Categories = sequelize.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Categories;

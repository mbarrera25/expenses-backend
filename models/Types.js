const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Types = sequelize.define('types', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    operation: {
        type: DataTypes.ENUM('+', '-'),
        allowNull: false,
        validate: {
            isIn: [['+', '-']]
        }
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    include_is_balance: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

});


module.exports = Types;
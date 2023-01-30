const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Package = sequelize.define("package",
    {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        discount: {
            type: DataTypes.DOUBLE,
            defaultValue: 0.0,
        },
        duration_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
    },
);

module.exports = Package;
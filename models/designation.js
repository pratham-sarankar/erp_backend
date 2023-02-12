const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Designation = sequelize.define("designation",
    {
        key: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },
    },
    {
        sequelize,
    },
);

module.exports = Designation;
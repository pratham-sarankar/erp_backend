const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Designation = sequelize.define("designation",
    {
        name: {
            type: DataTypes.STRING(100),
            unique:true,
            nullable:false,
        },
    },
    {
        sequelize,
    },
);

module.exports = Designation;
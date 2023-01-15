const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Module = sequelize.define("module",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        canAdd: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        canView: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        canEdit: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        canDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
    },
);


module.exports = Module;
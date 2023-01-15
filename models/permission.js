const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Permission = sequelize.define("permission",
    {
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


module.exports = Permission;
const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const PermissionGroup = sequelize.define("permission_group",
    {
        name: {
            type: DataTypes.STRING(50),
            unique:true,
        },
    },
    {
        sequelize,
    },
);

module.exports = PermissionGroup;
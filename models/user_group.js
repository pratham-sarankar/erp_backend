const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const UserGroup = sequelize.define("user_group",
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

module.exports = UserGroup;
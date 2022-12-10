const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Class = sequelize.define("class",
    {
        title: {
            type: DataTypes.STRING(100),
        },
        description:{
            type: DataTypes.TEXT("medium"),
        },
        limit:{
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
    },
);


module.exports = Class;
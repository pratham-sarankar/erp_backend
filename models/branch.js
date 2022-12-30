const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Branch = sequelize.define("branch",
    {
        name: {
            type: DataTypes.STRING(100),
        },
        address:{
            type:DataTypes.STRING(255),
        },
        phoneNumber:{
            type:DataTypes.STRING(15),
        },
    },
    {
        sequelize,
    },
);


module.exports = Branch;
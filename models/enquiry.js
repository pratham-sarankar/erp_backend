const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Enquiry = sequelize.define("enquiry",{
    firstName:{
        type: DataTypes.STRING(50),
    },
    lastName:{
        type: DataTypes.STRING(50),
    },
    email:{
        type: DataTypes.STRING(50),
    },
    subject: {
        type: DataTypes.TEXT('tiny'),
    },
    message:{
        type: DataTypes.TEXT('medium'),
    }
})

module.exports = Enquiry;
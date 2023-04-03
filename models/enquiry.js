const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Enquiry = sequelize.define("enquiry",{
    phoneNumber:{
        type: DataTypes.STRING(20),
    },
    subject: {
        type: DataTypes.TEXT('tiny'),
    },
    message:{
        type: DataTypes.TEXT('medium'),
    },
})

module.exports = Enquiry;
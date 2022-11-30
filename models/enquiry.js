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
        unique:true,
    },
    subject: {
        type: DataTypes.TEXT('tiny'),
    },
    message:{
        type: DataTypes.TEXT('medium'),
    }
})


Enquiry.sync().then(() => {
    console.log("Enquiry Model Synced");
}).catch((error) => {
    console.log(`Enquiry Model Syncing Failed : ${error}`);
})

module.exports = Enquiry;
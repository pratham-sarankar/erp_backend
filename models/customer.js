const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');

// Customers
// User

const Customer = sequelize.define("customer",
    {
        firstName: {
            type: DataTypes.STRING(50),
        },
        lastName: {
            type: DataTypes.STRING(50),
        },
        username: {
            type: DataTypes.STRING(75),
            unique: true,
        },
        photoUrl:{
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
        },
    },
    {
        sequelize,
    },
);

Customer.sync().then(() => {
    console.log("Customer Model Synced");
}).catch((error) => {
    console.log(`Customer Model Syncing Failed : ${error}`);
})

module.exports = Customer;
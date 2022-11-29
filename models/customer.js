const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');

// Customers
// User

const Customer = sequelize.define("customer",
    {
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        photoUrl:{
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
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
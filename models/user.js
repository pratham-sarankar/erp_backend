const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');

const User = sequelize.define("user",
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
    }
);

User.sync().then(() => {
    console.log("User Model Synced");
}).catch((error) => {
    console.log(`User Model Syncing Failed : ${error}`);
})

module.exports = User;
const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const User = sequelize.define("user",
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
        phoneNumber: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        dob:{
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        //TODO: Address here!
        idUrl:{
            type: DataTypes.STRING(255),
        },
        certUrl:{
            type: DataTypes.STRING(255),
        },
        password: {
            type: DataTypes.STRING(255),
        },
    },
    {
        sequelize,
        scopes: {
            withoutPassword: {
                attributes: { exclude: ['password'] },
            }
        }
    },
);

module.exports = User;
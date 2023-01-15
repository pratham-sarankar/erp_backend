const sequelize = require('../config/database');
const EncryptionController = require("../controllers/encryption_controller");
const {DataTypes} = require('sequelize');

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
        photoUrl: {
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            validate: {
                isEmail: true
            },
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            set(value) {
                this.setDataValue('password', EncryptionController.encryptPassword(value));
            }
        },
        branch_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        sequelize,
        scopes: {
            excludePassword: {
                attributes: {exclude: 'password'}
            }
        },
    },
);


module.exports = Customer;
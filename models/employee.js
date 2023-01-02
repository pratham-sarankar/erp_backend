const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Employee = sequelize.define("employee",
    {
        firstName: {
            type: DataTypes.STRING(50),
        },
        lastName: {
            type: DataTypes.STRING(50),
        },
        photoUrl: {
            type: DataTypes.STRING(255),
            validate: {
                isUrl: true,
            }
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            unique: true,

        },
        dob: {
            type: DataTypes.DATEONLY,
        },
        email: {
            type: DataTypes.STRING(50),
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        idUrl: {
            type: DataTypes.STRING(255),
            validate: {
                isUrl: true,
            }
        },
        certUrl: {
            type: DataTypes.STRING(255),
            validate: {
                isUrl: true,
            }
        },
    },
    {
        sequelize,
    },
);

module.exports = Employee;
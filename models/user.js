const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');
const EncryptionController = require("../controllers/encryption_controller");
const Employee = require("../models/employee");
const UserGroup = require("./permission_group");

const User = sequelize.define("user",
    {
        username: {
            type: DataTypes.STRING(50),
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('password', EncryptionController.encryptPassword(value));
            }
        },
        employee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Employee,
                key: 'id'
            },
            allowNull: false,
        },
        group_id: {
            type: DataTypes.INTEGER,
            references: {
                model: UserGroup,
                key: 'id'
            },
            allowNull: false,
        }
    },
    {
        sequelize,
        scopes: {
            excludePassword: {
                attributes: {
                    exclude: "password"
                }
            }
        }
    },
);

module.exports = User;
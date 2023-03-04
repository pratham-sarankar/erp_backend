const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');
const Package = require("./package");
const Duration = require("./duration");
const Class = require("./class");


const Payment = sequelize.define("payment",
    {
        order_id: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT("medium"),
        },
        mode_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize,
    },
);





module.exports = Payment;
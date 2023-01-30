const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Payment = sequelize.define("payment",
    {
        order_id: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
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
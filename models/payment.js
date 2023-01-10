const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Payment = sequelize.define("payment",
    {
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT("medium"),
        },
    },
    {
        sequelize,
    },
);


module.exports = Payment;
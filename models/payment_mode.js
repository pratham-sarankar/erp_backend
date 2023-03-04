const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const PaymentMode = sequelize.define("payment_mode",
    {
        title:{
            type: DataTypes.STRING,
        },
        key:{
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        sequelize,
    },
);


module.exports = PaymentMode;
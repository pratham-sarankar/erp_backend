const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const PaymentMode = sequelize.define("payment_mode",
    {
        title:{
          type: DataTypes.STRING,
        },
    },
    {
        sequelize,
    },
);


module.exports = PaymentMode;
const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');
const Package = require("./package");
const Duration = require("./duration");
const Class = require("./class");
const Razorpay = require("razorpay");


const Payment = sequelize.define("payment",
    {
        order_id: {
            type: DataTypes.STRING,
            unique: true,
        },
        amount:{
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


Payment.beforeCreate(async (payment, options) => {
    //Adding order amount;
    if(!payment.order_id){
        const instance = new Razorpay({key_id: process.env.RZR_KEY_ID, key_secret: process.env.RZR_KEY_SECRET});
        const order = await instance.orders.fetch(payment.order_id);
        payment.amount = order.amount;
    }
});




module.exports = Payment;
const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');
const Course = require("./course");
const Payment = require("./payment");

const Purchase = sequelize.define("purchase",
    {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purchased_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        discount_type:{
            type: DataTypes.STRING(10),
            defaultValue: "none",
            validate: {
                isIn: [['percentage', 'price', 'none']],
            },
        },
        discount_value:{
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
        original_amount:{
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
        discounted_amount:{
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
    },
    {
        sequelize,
    },
);

Purchase.beforeCreate(async (purchase, options) => {
    const foundCourse = await Course.findByPk(purchase.course_id);
    const payment = await Payment.findByPk(purchase.payment_id);
    purchase.original_amount = foundCourse.price;
    purchase.discounted_amount = payment.amount;
})


module.exports = Purchase;
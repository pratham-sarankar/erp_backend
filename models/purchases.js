const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


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
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purchased_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
    },
);

module.exports = Purchase;
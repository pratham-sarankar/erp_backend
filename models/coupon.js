const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Coupon = sequelize.define("coupon",
    {
        name: {
            type: DataTypes.STRING(100),
        },
        discount:{
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        maxUsage:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        expireAt:{
            type:DataTypes.DATE,
            allowNull:false,
        },
    },
    {
        sequelize,
    },
);


module.exports = Coupon;
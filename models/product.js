const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Product = sequelize.define("product",
    {
        title: {
            type: DataTypes.STRING(100),
        },
        photoUrl:{
            type:DataTypes.STRING(255),
        },
        price:{
            type:DataTypes.INTEGER,
        },
        discount:{
            type:DataTypes.DOUBLE,
        }
    },
    {
        sequelize,
    },
);

module.exports = Product;
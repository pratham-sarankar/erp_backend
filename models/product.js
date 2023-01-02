const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Product = sequelize.define("product",
    {
        title: {
            type: DataTypes.STRING(100),
        },
        photoUrl:{
            type:DataTypes.STRING(255),
            validate: {
                isUrl: true,
            }
        },
        price:{
            type:DataTypes.INTEGER,
            validate: {
                isNumeric: true,
            }
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
const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Class = sequelize.define("class",
    {
        title: {
            type: DataTypes.STRING(100),
        },
        photoUrl: {
            type: DataTypes.STRING(255),
        },
        description: {
            type: DataTypes.TEXT("medium"),
        },
        price: {
            type: DataTypes.DOUBLE,
            validate:{
                isNumeric:true,
            }
        },
        branch_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        sequelize,
    },
);


module.exports = Class;
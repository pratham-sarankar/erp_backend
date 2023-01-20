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
        schedule:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        start_time:{
            type:DataTypes.TIME,
            allowNull:false,
        },
        end_time:{
            type:DataTypes.TIME,
            allowNull:false,
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
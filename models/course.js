const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Course = sequelize.define("course",
    {
        photoUrl:{
            type:DataTypes.STRING(255),
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT("medium"),
        },
        starting_date:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.DOUBLE,
            validate:{
                isNumeric:true,
            }
        },
        price:{
            type: DataTypes.DOUBLE,
            validate:{
                isNumeric:true,
            },
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


module.exports = Course;
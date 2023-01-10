const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Course = sequelize.define("course",
    {
        title: {
            type: DataTypes.STRING(100),

        },
        photoUrl:{
            type:DataTypes.STRING(255),
        },
        description:{
            type: DataTypes.TEXT("medium"),
        },
        duration: {
            type: DataTypes.DOUBLE,
            validate:{
                isNumeric:true,
            }
        }
    },
    {
        sequelize,
    },
);


module.exports = Course;
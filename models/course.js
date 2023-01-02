const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Course = sequelize.define("course",
    {
        title: {
            type: DataTypes.STRING(100),

        },
        photoUrl:{
            type:DataTypes.STRING(255),
            validate:{
                isUrl:true,
            }
        },
        description:{
            type: DataTypes.TEXT("medium"),
        },
    },
    {
        sequelize,
    },
);


module.exports = Course;
const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const Batch = sequelize.define("batch",
    {
        name: {
            type: DataTypes.STRING(100),
        },
        start_time:{
            type:DataTypes.TIME,
            allowNull:false,
        },
        end_time:{
            type:DataTypes.TIME,
            allowNull:false,
        },
        class_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        sequelize,
    },
);


module.exports = Batch;
const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const CallLog = sequelize.define("call_log",
    {
        customer_phone_number: DataTypes.STRING,
        branch_phone_number: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        date:DataTypes.DATEONLY,
        time: DataTypes.TIME,
        duration: DataTypes.INTEGER,
        recordingUrl: DataTypes.STRING,
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        customer_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        sequelize,
    },
);


module.exports = CallLog;
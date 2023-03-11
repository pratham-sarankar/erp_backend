const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const CallLog = sequelize.define("call_log",
    {
        status: DataTypes.STRING,
        destinationNumber: DataTypes.STRING,
        destinationOperatorName: DataTypes.STRING,
        time: DataTypes.TIME,
        type: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        recordingUrl: DataTypes.STRING,
        date:DataTypes.DATEONLY,
    },
    {
        sequelize,
    },
);


module.exports = CallLog;
const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const CallLog = sequelize.define("call_log",
    {
        to: DataTypes.STRING,
        from: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        date:DataTypes.DATEONLY,
        time: DataTypes.TIME,
        duration: DataTypes.INTEGER,
        recordingUrl: DataTypes.STRING,
    },
    {
        sequelize,
    },
);


module.exports = CallLog;
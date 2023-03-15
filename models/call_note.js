const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const CallNote = sequelize.define("call_note",
    {
        customer_phone_number: DataTypes.STRING,
        branch_phone_number: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        date:DataTypes.DATEONLY,
        time: DataTypes.TIME,
        duration: DataTypes.STRING,
        recordingUrl: DataTypes.STRING,
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
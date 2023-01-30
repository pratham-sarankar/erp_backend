const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');


const Duration = sequelize.define("duration",
    {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        days: DataTypes.INTEGER,
    },
    {
        sequelize,
    },
);

module.exports = Duration;
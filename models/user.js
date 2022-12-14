const sequelize = require('../config/database')
const { DataTypes } = require('sequelize');


const User = sequelize.define("user",
    {
        username: {
            type: DataTypes.STRING(50),
            unique:true,
        },
        password:DataTypes.STRING,
    },
    {
        sequelize,
        scopes:{
            withoutPassword:{
                attributes:{
                    exclude : "password"
                }
            }
        }
    },
);

module.exports = User;
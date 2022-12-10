const sequelize = require("../config/database");
const {DataTypes} = require("sequelize");


const Tag = sequelize.define("tag",
    {
        name:{
            type: DataTypes.STRING,
            unique:true,
        }
    },
    {
        sequelize,
    },
);


module.exports = Tag;
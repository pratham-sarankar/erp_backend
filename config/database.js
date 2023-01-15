const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
})

sequelize.authenticate().then(async ()=>{
    console.log("Database Connection Established");
    await sequelize.sync({
        // force:true,
        // alter:true,
    });
}).catch((error)=>{
    console.log(`Database Connection Failed ${error}`);
})

module.exports = sequelize;
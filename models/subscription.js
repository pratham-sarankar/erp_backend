const sequelize = require('../config/database')
const Sequelize = require("sequelize");
const {DataTypes} = require('sequelize');
const Package = require("./package");
const Duration = require("./duration");
const Class = require("./class");


const Subscription = sequelize.define("subscription",
    {
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        payment_id: {
            type: DataTypes.INTEGER,
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subscribedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        expiringAt: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
    },
);

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Subscription.beforeCreate(async (subscription, options) => {
    //Adding expiring date;
    const foundPackage = await Package.findByPk(subscription.package_id, {include: Duration});
    let date = new Date();
    date = date.addDays(foundPackage.duration.days)
    subscription.expiringAt = date;

    //Adding branch id;
    if(!subscription.branch_id){
        const foundClass = await Class.findByPk(foundPackage.class_id);
        subscription.branch_id = foundClass.branch_id;
    }
});


module.exports = Subscription;
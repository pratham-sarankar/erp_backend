const sequelize = require('../config/database')
const Sequelize = require("sequelize");
const {DataTypes} = require('sequelize');
const Package = require("./package");
const Duration = require("./duration");


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
        }
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
});


module.exports = Subscription;
const sequelize = require('../config/database')
const Sequelize = require("sequelize");
const {DataTypes} = require('sequelize');
const Package = require("./package");
const Duration = require("./duration");
const Class = require("./class");
const Payment = require("./payment");


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
        discount_type:{
            type: DataTypes.STRING(10),
            defaultValue: "none",
            validate: {
                isIn: [['percentage', 'price', 'none']],
            },
        },
        discount_value:{
            type: DataTypes.DOUBLE,
            defaultValue: 0,
        },
        original_amount:{
            type: DataTypes.DOUBLE,
        },
        discounted_amount:{
            type: DataTypes.DOUBLE,
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
  const foundPackage = await Package.findByPk(subscription.package_id);
  const payment = await Payment.findByPk(subscription.payment_id);
  subscription.original_amount = foundPackage.price;
  subscription.discounted_amount = payment.amount;
})

Subscription.beforeCreate(async (subscription, options) => {
    //Check if the customer has already subscribed to the package and the subscription is not expired
    const foundSubscription = await Subscription.findOne({
        where: {
            customer_id: subscription.customer_id,
            package_id: subscription.package_id,
            expiringAt: {
                [Sequelize.Op.gte]: new Date()
            }
        }
    });

    let date = new Date();
    if (foundSubscription) {
        date = foundSubscription.expiringAt;
    }

    //Adding expiring date;
    const foundPackage = await Package.findByPk(subscription.package_id, {include: Duration});
    date = date.addDays(foundPackage.duration.days)
    subscription.expiringAt = date;

    //Adding branch id;
    if(!subscription.branch_id){
        const foundClass = await Class.findByPk(foundPackage.class_id);
        subscription.branch_id = foundClass.branch_id;
    }
});


module.exports = Subscription;
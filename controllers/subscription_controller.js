const Subscription = require("../models/subscription");
const Customer = require("../models/customer");
const Package = require("../models/package");
const Payment = require("../models/payment");
const Class = require("../models/class");
const PaymentMode = require("../models/payment_mode");

async function insert(req, res, next) {
    const packageId = req.body.package_id;
    try {
        if (!req.body.payment_id) {
            const foundPackage = await Package.findByPk(packageId);
            req.body.amount = foundPackage.price - ((foundPackage.discount / 100) * foundPackage.price);
            console.log(req.body.amount);
            const payment = await Payment.create(req.body);
            await payment.reload();
            req.body.payment_id = payment.id;
        }
        const newSubscription = await Subscription.create(req.body);
        return res.status(201).json({status: "success", data: newSubscription, message: "New Subscription created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundSubscription = await Subscription.findByPk(id);
        if (foundSubscription == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Subscription not found."
        });
        return res.status(200).json({
            status: "success",
            data: foundSubscription,
            message: "Subscription fetched successfully."
        });
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        const subscriptions = await Subscription.findAll(
            {
                where: req.query,
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: Customer,
                    }, {
                        model: Package,
                        include: {
                            model: Class,
                        }
                    }, {
                        model: Payment,
                        include: {
                            model: PaymentMode,
                        }
                    },
                ],

            },
        );
        return res.status(200).json({
            status: "success",
            data: subscriptions,
            message: "Subscriptions fetched successfully."
        });
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Subscription.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Subscription updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundSubscription = await Subscription.findByPk(id);
        if (foundSubscription == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Subscription not found."
        });
        await foundSubscription.destroy();
        res.status(200).json({status: "success", data: null, message: "Subscription deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Subscription.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Subscriptions deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
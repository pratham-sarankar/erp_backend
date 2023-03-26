const Subscription = require("../models/subscription");
const Customer = require("../models/customer");
const Package = require("../models/package");
const Payment = require("../models/payment");
const Class = require("../models/class");
const Coupon = require("../models/coupon");
const PaymentMode = require("../models/payment_mode");
const {Op} = require("sequelize");

async function insert(req, res, next) {
    try {
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
        if (req.query.class_id) {
            const classId = req.query.class_id;
            const classPackages = await Package.findAll({where: {class_id: classId}});
            const ids = classPackages.map(value => value.id);
            req.query.package_id = ids
            // return res.json({classId:classId,packages:ids})
        }
        delete req.query.class_id;

        if (req.query.search){
            const search = req.query.search;
            //Find all customers with firstName, lastName, username, email, or phoneNumber like search
            const customers = await Customer.findAll({
                where: {
                    [Op.or]: [
                        {firstName: {[Op.like]: `%${search}%`}},
                        {lastName: {[Op.like]: `%${search}%`}},
                        {username: {[Op.like]: `%${search}%`}},
                        {email: {[Op.like]: `%${search}%`}},
                        {phoneNumber: {[Op.like]: `%${search}%`}},
                        //Write query for case when search will be firstName lastName
                        {
                            [Op.and]: [
                                {firstName: {[Op.like]: `%${search.split(' ')[0]}%`}},
                                {lastName: {[Op.like]: `%${search.split(' ')[1]}%`}},
                            ]
                        },
                    ]
                }
            });
            const customerIds = customers.map(value => value.id);

            //Find all packages with title like search
            const packages = await Package.findAll({
                where: {
                    title: {[Op.like]: `%${search}%`},
                }
            });
            const packageIds = packages.map(value => value.id);

            //Find all subscriptions with packageIds or customerIds
            req.query = {
                [Op.or]: [
                    {package_id: {[Op.in]: packageIds}},
                    {customer_id: {[Op.in]: customerIds}},
                ],
                ...req.query,
            }


        }
        delete req.query.search;

        //Find the order in the query string
        //If order is not null, then order by the order
        let order = [];
        if (req.query.order){
            const orderColumn = req.query.order;

            //Initialize orderDirection to ASC
            let orderDirection = "ASC";
            //If DESC is true, then orderDirection is DESC
            if (req.query.DESC === "true"){
                orderDirection = "DESC";
            }

            if (orderColumn === "customer"){
                order = [
                    [Customer, "firstName", orderDirection],
                    [Customer, "lastName", orderDirection],
                ]
            }else if (orderColumn === "package"){
                order = [
                    [Package, "title", orderDirection],
                ]
            }else if (orderColumn === "class"){
                order = [
                    [Package, Class, "title", orderDirection],
                ]
            }else if (orderColumn === "payment_mode"){
                order = [
                    [Payment, PaymentMode, "title", orderDirection],
                ]
            }else if (orderColumn === "coupon"){
                order = [
                    [Coupon, "title", orderDirection],
                ]
            }else if(orderColumn==="expiry_date"){
                order = [
                    ["expiringAt", orderDirection],
                ]
            }else if(orderColumn==="subscribed_date"){
                order = [
                    ["subscribedAt", orderDirection],
                ]
            }

        }
        delete req.query.order;
        delete req.query.DESC;

        order = [
            ...order,
            ["createdAt", "DESC"],
        ]

        const options = {
            where: req.query,
            limit: limit,
            offset: offset,
            order: order,
            distinct: true,
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

        };
        let subscriptions;
        const withCount = req.query.count;
        delete req.query.count;
        if (withCount) {
            subscriptions = await Subscription.findAndCountAll(options);
        }else{
            subscriptions = await Subscription.findAll(options);
        }
        return res.status(200).json({
            status: "success",
            data: subscriptions,
            message: "Subscriptions fetched successfully."
        });
    } catch (err) {
        next(err);
    }
}

async function fetchWithCount(req,res,next){
    req.query.count = true;
    return fetch(req,res,next);
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

module.exports = {insert, fetchOne, fetch,fetchWithCount, update, destroy, destroyMany};
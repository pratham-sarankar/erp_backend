const Purchase = require("../models/purchase");
const Customer = require("../models/customer");
const Course = require("../models/course");
const PaymentMode = require("../models/payment_mode");
const Payment = require("../models/payment");
const {Op} = require("sequelize");

async function insert(req, res, next) {
    try {
        const newPurchase = await Purchase.create(req.body);
        return res.status(201).json({status: "success", data: newPurchase, message: "New Purchase created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundPurchase = await Purchase.findByPk(id);
        if (foundPurchase == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Purchase not found."
        });
        return res.status(200).json({
            status: "success",
            data: foundPurchase,
            message: "Purchase fetched successfully."
        });
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");

    try {

        if (req.query.search){
            const search = req.query.search;
            //Find all purchases with course title like search
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

            //Find all course with title like search
            const courses = await Course.findAll({
                where: {
                    title: {[Op.like]: `%${search}%`},
                }
            });
            const coursesIds = courses.map(value => value.id);

            //Find all subscriptions with packageIds or customerIds
            req.query = {
                [Op.or]: [
                    {course_id: {[Op.in]: coursesIds}},
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
            }else if (orderColumn === "course"){
                order = [
                    [Course, "title", orderDirection],
                ]
            }else if (orderColumn === "payment_mode"){
                order = [
                    [Payment, PaymentMode, "title", orderDirection],
                ]
            }else if (orderColumn === "discount"){
                order = [
                    ['discount_type', orderDirection],
                    ['discount_value', orderDirection],
                ]
            }else if(orderColumn==="purchased_date"){
                order = [
                    ["purchased_at", orderDirection],
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
                    model: Course,
                }, {
                    model: Payment,
                    include: {
                        model: PaymentMode,
                    }
                },
            ],

        };
        let purchases;
        const withCount = req.query.count;
        delete req.query.count;
        if (withCount) {
            purchases = await Purchase.findAndCountAll(options);
        }else{
            purchases = await Purchase.findAll(options);
        }
        return res.status(200).json({
            status: "success",
            data: purchases,
            message: "Purchases fetched successfully."
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
        await Purchase.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Purchases updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundPurchases = await Purchase.findByPk(id);
        if (foundPurchases == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Purchases not found."
        });
        await foundPurchases.destroy();
        res.status(200).json({status: "success", data: null, message: "Purchases deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Purchase.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Purchases deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch, fetchWithCount, update, destroy, destroyMany};
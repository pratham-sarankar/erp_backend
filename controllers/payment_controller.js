const Payment = require("../models/payment");
const PaymentMode = require("../models/payment_mode");
const Customer = require("../models/customer");
const {Op} = require("sequelize");
const moment = require("moment");

async function insert(req, res, next) {
    try {
        const newPayment = await Payment.create(req.body);
        return res.status(201).json({status: "success", data: newPayment, message: "New payment created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundPayment = await Payment.findByPk(id, {include: PaymentMode});
        if (foundPayment == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Payment not found."
        });
        return res.status(200).json({status: "success", data: foundPayment, message: "Payment fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetchSummary(req, res) {
    const { range } = req.query;
    let fromDate, toDate, prevFromDate, prevToDate;

    // Set fromDate and toDate based on the selected range
    switch (range) {
        case 'weekly':
            fromDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
            toDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
            prevFromDate = moment().startOf('isoWeek').subtract(1, 'week').format('YYYY-MM-DD');
            prevToDate = moment().endOf('isoWeek').subtract(1, 'week').format('YYYY-MM-DD');
            break;
        case 'monthly':
            fromDate = moment().startOf('month').format('YYYY-MM-DD');
            toDate = moment().endOf('month').format('YYYY-MM-DD');
            prevFromDate = moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD');
            prevToDate = moment().endOf('month').subtract(1, 'month').format('YYYY-MM-DD');
            break;
        case 'yearly':
            fromDate = moment().startOf('year').format('YYYY-MM-DD');
            toDate = moment().endOf('year').format('YYYY-MM-DD');
            prevFromDate = moment().startOf('year').subtract(1, 'year').format('YYYY-MM-DD');
            prevToDate = moment().endOf('year').subtract(1, 'year').format('YYYY-MM-DD');
            break;
        default:
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Invalid range parameter',
            });
    }

    delete req.query.range;

    // Find payments for the current range
    const payments = await Payment.findAll({
        where: {
            ...req.query,
            createdAt: {
                [Op.between]: [fromDate, toDate],
            },
        },
        include: [
            {
                model: Customer,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
            }
        ],
    });

    // Find total amount for the current range
    const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);

    // Find payments for the previous range
    const prevPayments = await Payment.findAll({
        where: {
            ...req.query,
            createdAt: {
                [Op.between]: [prevFromDate, prevToDate],
            },
        },
        include: [
            {
                model: Customer,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
            }
        ],
    });



    // Find total amount for the previous range
    const prevTotalAmount = prevPayments.reduce((total, payment) => total + payment.amount, 0);

    const percent = parseFloat((((totalAmount - prevTotalAmount) / prevTotalAmount) * 100).toFixed(1));

    const monthlyPaymentSummary = await _monthlyPaymentSummary(req);

    // Send response
    return res.status(200).json({
        status: 'success',
        data: {
            total: totalAmount,
            percentage: percent,
            recent: payments,
            monthly: monthlyPaymentSummary,
            // current: {
            //     total: totalAmount,
            //     payments: payments,
            // },
            // previous: {
            //     total: prevTotalAmount,
            //     payments: prevPayments,
            // },
        },
        message: 'Payments fetched successfully.',
    });
}

async function _monthlyPaymentSummary(req){
    const currentYear = moment().year(); // Get the current year
    const paymentsByMonth = [];

    // Loop through all the months of the current year
    for (let month = 0; month < 12; month++) {
        const fromDate = moment().year(currentYear).month(month).startOf('month').format('YYYY-MM-DD');
        const toDate = moment().year(currentYear).month(month).endOf('month').format('YYYY-MM-DD');

        // Find payments for the current month
        const payments = await Payment.findAll({
            where: {
                ...req.query,
                createdAt: {
                    [Op.between]: [fromDate, toDate],
                },
            },
        });

        // Find total amount for the current month
        const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0);

        paymentsByMonth.push(totalAmount);
    }
    return paymentsByMonth;
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {

        if(req.query.search){
            const search = req.query.search;
            req.query = {
                [Op.or]: [
                    {amount: {[Op.lte]: search}},
                    {description: {[Op.like]: `%${search}%`}},
                ],
                ...req.query,
            }
        }
        delete req.query.search;

        let order = [];
        if(req.query.order){
            const orderColumn = req.query.order;
            //Initialize orderDirection to ASC
            let orderDirection = "ASC";
            //If DESC is true, then orderDirection is DESC
            if (req.query.DESC === "true"){
                orderDirection = "DESC";
            }

            if (orderColumn === "amount"){
                order = [
                    ["amount", orderDirection],
                ]
            }else if (orderColumn === "description"){
                order = [
                    ["description", orderDirection]
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
                order: order,
                offset: offset,
                include: [
                    {
                        model: Customer,
                    },
                    {
                        model: PaymentMode,
                    }
                ]
            };


        let payments;
        const withCount = req.query.count;
        delete req.query.count;

        if(withCount){
            payments= await Payment.findAndCountAll(options);
        }else{
            payments = await Payment.findAll(options);
        }

        return res.status(200).json({status: "success", data: payments, message: "payments fetched successfully."});
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
        await Payment.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Payment updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundPayment = await Payment.findByPk(id);
        if (foundPayment == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Payment not found."
        });
        await foundPayment.destroy();
        res.status(200).json({status: "success", data: null, message: "Payment deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Payment.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Payments deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne,  fetch, fetchSummary, fetchWithCount, update, destroy, destroyMany};
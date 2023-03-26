const PaymentMode = require("../models/payment_mode");
const Customer= require("../models/customer");
const {Op} = require("sequelize");

async function insert(req, res, next) {
    try {
        const newPaymentMode = await PaymentMode.create(req.body);
        return res.status(201).json({status: "success", data: newPaymentMode, message: "New Payment mode created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundPaymentMode = await PaymentMode.findByPk(id);
        if (foundPaymentMode == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Payment mode not found."
        });
        return res.status(200).json({status: "success", data: foundPaymentMode, message: "Payment mode fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        if(req.query.search){
            //Find all modes with title like search
            req.query = {
                [Op.or]: [
                    {title: {[Op.like]: `%${req.query.search}%`}},
                ]
            }
        }
        delete req.query.search;

        const paymentModes = await PaymentMode.findAll(
            {
                where: req.query,
                limit: limit,
                offset: offset,
            },
        );
        return res.status(200).json({status: "success", data: paymentModes, message: "Payment Modes fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await PaymentMode.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Payment mode updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundPaymentMode = await PaymentMode.findByPk(id);
        if (foundPaymentMode == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "PaymentMode not found."
        });
        await foundPaymentMode.destroy();
        res.status(200).json({status: "success", data: null, message: "PaymentMode deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await PaymentMode.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "PaymentModes deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
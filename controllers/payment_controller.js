const Payment = require("../models/payment");
const PaymentMode = require("../models/payment_mode");
const Customer = require("../models/customer");

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

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        const payments = await Payment.findAll(
            {
                where: req.query,
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: Customer,
                    },
                    {
                        model: PaymentMode,
                    }
                ]
            },
        );
        return res.status(200).json({status: "success", data: payments, message: "payments fetched successfully."});
    } catch (err) {
        next(err);
    }
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

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
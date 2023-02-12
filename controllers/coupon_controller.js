const sequelize = require("../config/database");
const Coupon = require("../models/coupon");

async function insert(req, res, next) {
    try {
        let branch = await Coupon.create(req.body);
        res.status(201).json({status: "success", data: branch, message: "Coupon created successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const couponId = req.params.id;
    try {
        let coupon = await Coupon.findByPk(couponId);
        if (coupon == null) return res.status(404).json({status: "error", data: null, message: "Coupon doesn't exist"});
        return res.status(200).json({status: "success", data: coupon, message: "Coupon fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetch(req, res, next) {
    try {
        let coupons = await Coupon.findAll();
        return res.status(200).json({status: "success", data: coupons, message: "Coupons fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Coupon.update(req.body,{where:{id:id}});
        res.status(200).json({status: "success", data: null, message: "Coupon updated successfully."});
    } catch (err) {
        next(err);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        await Coupon.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "Coupon deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query;

    try {
        await Coupon.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "Coupons deleted successfully."});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetch, fetchOne, update, destroy, destroyMany};
const Duration_controller = require("../../models/duration");
const Class = require("../../models/class");
const {Sequelize} = require("sequelize");

async function insert(req, res, next) {
    try {
        const newDuration = await Duration_controller.create(req.body);
        return res.status(201).json({status: "success", data: newDuration, message: "New Duration_controller created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundDuration = await Duration_controller.findByPk(id);
        if (foundDuration == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Duration_controller not found."
        });
        return res.status(200).json({status: "success", data: foundDuration, message: "Duration_controller fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    try {
        const durations = await Duration_controller.findAll({
            order:[
                ['days', 'ASC'],
            ]
        });
        return res.status(200).json({status: "success", data: durations, message: "Durations fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Duration_controller.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Duration_controller updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundDuration = await Duration_controller.findByPk(id);
        if (foundDuration == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Duration_controller not found."
        });
        await foundDuration.destroy();
        res.status(200).json({status: "success", data: null, message: "Duration_controller deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Duration_controller.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Durations deleted successfully"});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
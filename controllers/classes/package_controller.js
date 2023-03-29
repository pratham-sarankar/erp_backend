const Package = require("../../models/package");
const Duration = require("../../models/duration");
const Class = require("../../models/class");
const {Sequelize} = require("sequelize");

async function insert(req, res, next) {
    try {
        const newPackage = await Package.create(req.body);
        return res.status(201).json({status: "success", data: newPackage, message: "New Package created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundPackage = await Package.findByPk(id);
        if (foundPackage == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Package not found."
        });
        return res.status(200).json({status: "success", data: foundPackage, message: "Package fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    let options = {
        where: req.query,
        include: Duration
    };

    try {
        const packages = await Package.findAll(options);
        return res.status(200).json({status: "success", data: packages, message: "Packages fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Package.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Package updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundPackage = await Package.findByPk(id);
        if (foundPackage == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Package not found."
        });
        await foundPackage.destroy();
        res.status(200).json({status: "success", data: null, message: "Package deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Package.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Packages deleted successfully"});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
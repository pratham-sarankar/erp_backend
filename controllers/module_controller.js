const Module = require("../models/module");

async function insert(req, res, next) {
    try {
        const newModule = await Module.create(req.body);
        return res.status(201).json({status: "success", data: newModule, message: "New module created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundModule = await Module.findByPk(id);
        if(foundModule==null)return res.status(404).json({status:"error",data:null,message:"Module not found."});
        return res.status(200).json({status: "success", data: foundModule, message: "Module fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    try {
        const modules = await Module.findAll(req.query);
        return res.status(200).json({status: "success", data: modules, message: "Modules fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Module.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Module updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundModule = await Module.findByPk(id);
        if (foundModule == null) return res.status(404).json({status: "error", data: null, message: "Module not found."});
        await foundModule.destroy();
        res.status(200).json({status: "success", data: null, message: "Module deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Module.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Modules deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
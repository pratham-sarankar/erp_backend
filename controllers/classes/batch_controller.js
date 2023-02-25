const Batch = require("../../models/batch");
const Class = require("../../models/class");

async function insert(req, res, next) {
    try {
        const newBatch = await Batch.create(req.body);
        return res.status(201).json({status: "success", data: newBatch, message: "New batch created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundBatch = await Batch.findByPk(id, {
            include: {model: Class}
        });
        if (foundBatch == null) return res.status(404).json({status: "error", data: null, message: "Batch not found."});
        return res.status(200).json({status: "success", data: foundBatch, message: "Batch fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        const batches = await Batch.findAll(
            {
                where: req.query,
                limit: limit,
                offset: offset,
                include: {
                    model: Class,
                }
            },
        );
        return res.status(200).json({status: "success", data: batches, message: "Batches fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Batch.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Batch updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundBatch = await Batch.findByPk(id);
        if (foundBatch == null) return res.status(404).json({status: "error", data: null, message: "Batch not found."});
        await foundBatch.destroy();
        res.status(200).json({status: "success", data: null, message: "Batch deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Batch.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Batches deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
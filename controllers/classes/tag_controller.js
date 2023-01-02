const Tag = require("../../models/tag");

async function insert(req, res, next) {
    try {
        const newTag = await Tag.create(req.body);
        return res.status(201).json({status: "success", data: newTag, message: "New tag created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundTag = await Tag.findByPk(id);
        if(foundTag==null)return res.status(404).json({status:"error",data:null,message:"Tag not found."});
        return res.status(200).json({status: "success", data: foundTag, message: "Tag fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    try {
        const tags = await Tag.findAndCountAll(req.query);
        return res.status(200).json({status: "success", data: tags, message: "Tags fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Tag.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Tag updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundTag = await Tag.findByPk(id);
        if (foundTag == null) return res.status(404).json({status: "error", data: null, message: "Tag not found."});
        await foundTag.destroy();
        res.status(200).json({status: "success", data: null, message: "Tag deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Tag.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Tags deleted successfully"});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
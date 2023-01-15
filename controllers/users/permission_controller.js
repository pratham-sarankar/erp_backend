const Permission = require("../../models/permission");
const Module = require("../../models/module");

async function insert(req, res, next) {
    try {
        const permission = await Permission.create(req.body);
        res.status(201).json({
            status: "success",
            data: permission,
            message: "Permission created successfully."
        });
    } catch (err) {
        next(err);
    }
}


async function fetchOne(req, res, next) {
    const groupId = req.params.groupId;
    const moduleId = req.params.moduleId;
    try {
        const foundPermission = await Permission.findOne({
            where: {
                group_id: groupId, module_id: moduleId,
            }
        });
        if (foundPermission == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Permission not found."
        });
        return res.status(200).json({
            status: "success",
            data: foundPermission,
            message: "Permission fetched successfully."
        });
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    try {
        const permissions = await Permission.findAll(req.query);
        return res.status(200).json({
            status: "success",
            data: permissions,
            message: "Permission fetched successfully."
        });
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const groupId = req.params.groupId;
    const moduleId = req.params.moduleId;
    try {
        await Permission.update(req.body, {where: {group_id: groupId,module_id:moduleId}});
        res.status(200).json({status: "success", data: null, message: "Permission updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const groupId = req.params.groupId;
    const moduleId = req.params.moduleId;
    try {
        const permission = await Permission.findOne({where: {group_id: groupId,module_id:moduleId}});
        if (permission == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Permission not found."
        });
        await permission.destroy();
        res.status(200).json({status: "success", data: null, message: "Permission deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Permission.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Permissions deleted successfully"});
    } catch (err) {
        next(err);
    }

}


module.exports = {insert, fetch, fetchOne, update, destroy, destroyMany};
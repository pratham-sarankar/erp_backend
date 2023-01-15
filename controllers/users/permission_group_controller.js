const User = require("../../models/user");
const PermissionGroup = require("../../models/permission_group")
const sequelize = require("../../config/database");
const Module = require("../../models/module");
const Permission = require("../../models/permission");

async function insert(req, res, next) {
    try {
        const permissionGroup = await PermissionGroup.create(req.body);
        res.status(201).json({
            status: "success", data: permissionGroup, message: "Permission Group created successfully."
        });

    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const groupId = req.params.id;
    try {
        const userGroup = await PermissionGroup.findByPk(groupId, {
            include: {
                model: Permission, include: {
                    model: Module, attributes: ["id", "name"]
                }
            }
        });
        res.status(200).json({status: "success", data: userGroup, message: "User group fetched successfully."});
    } catch (err) {
        next(err);
    }

}

async function fetch(req, res, next) {
    try {
        const permissionGroups = await PermissionGroup.findAll({
            attributes: ["id", "name", [sequelize.fn('COUNT', sequelize.col('users.id')), 'users_count']],
            include: [
                {
                    model: User,
                    attributes: []
                },
            ], group: ['id']
        });
        for (const group of permissionGroups) {
            group.dataValues.permissions = await Permission.findAll(
                {
                    where: {group_id: group.id},
                    attributes: ["group_id", "module_id", "canAdd", "canEdit", "canView", "canDelete"],
                    include: {
                        model: Module,
                        attributes: ["id", "name"]
                    },
                });
        }
        return res.status(200).json({
            status: "success", data: permissionGroups, message: "Permission groups fetched successfully."
        });
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await PermissionGroup.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "User group updated successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        await PermissionGroup.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "User group deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await PermissionGroup.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "User group deleted successfully."});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
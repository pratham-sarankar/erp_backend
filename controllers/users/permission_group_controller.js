const User = require("../../models/user");
const UserGroup = require("../../models/permission_group")
const sequelize = require("../../config/database");

async function insert(req, res, next) {
    try {
        const userGroup = await UserGroup.create(req.body);
        res.status(201).json({status: "success", data: userGroup, message: "User group created successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const groupId = req.params.id;
    try {
        const userGroup = await UserGroup.findByPk(groupId, {include: {model: User}});
        res.status(200).json({status: "success", data: userGroup, message: "User group fetched successfully."});
    } catch (err) {
        next(err);
    }

}

async function fetch(req, res, next) {
    try {
        const userGroups = await UserGroup.findAll({
            attributes: ["id", "name", [sequelize.fn('COUNT', sequelize.col('users.id')), 'users_count']],
            include: {
                model: User,
                attributes: []
            },
            group: ['id']
        });
        return res.status(200).json({
            status: "success",
            data: userGroups,
            message: "User groups fetched successfully."
        });
    } catch (err) {
        next(err);
    }
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await UserGroup.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "User group updated successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res,next) {
    const id = req.params.id;
    try {
        await UserGroup.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "User group deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req,res,next){
    const ids = req.query.ids;
    try {
        await UserGroup.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "User group deleted successfully."});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy,destroyMany};
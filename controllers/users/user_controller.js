const User = require("../../models/user");
const Employee = require("../../models/employee");
const EncryptionController = require("../encryption_controller");
const TokenController = require("../token_controller");
const PermissionGroup = require("../../models/permission_group");

async function insert(req, res, next) {
    try {
        await User.create(req.body, {include: [PermissionGroup, Employee]});
        return res.status(200).json({status: "success", data: null, message: "User created successfully."});
    } catch (err) {
        next(err);
    }
}


async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const user = await User.scope('excludePassword').findByPk(id, {include: PermissionGroup});
        if (user == null) return res.status(404).json({status: "error", data: user, message: "User not found"});
        res.status(200).json({status: "success", data: user, message: "User fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function fetch(req, res, next) {
    try {
        const users = await User.scope('excludePassword').findAll({include: [PermissionGroup, Employee], ...req.query});
        res.status(200).json({status: "success", data: users, message: "Users fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        await User.update(req.body, {where: {id: id}});
        return res.status(200).json({status: "success", data: null, message: "User updated successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        await User.destroy({id: id})
        return res.status(200).json({status: "success", data: null, message: "User deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await User.destroy({where: {id: ids}});
        return res.status(200).json({status: "success", data: null, message: "Users deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({where: {username: username}, include: [Employee, PermissionGroup]});
        if (user == null) return res.status(404).json({status: "error", data: null, message: "User not found"});

        const matched = EncryptionController.comparePassword(password, user.password);
        if (!matched) return res.status(400).json({status: "error", data: null, message: "Incorrect password."});

        const token = TokenController.generateNewToken(user);
        return res.status(200).json({
            status: "success",
            data: {user: user, token: token},
            message: "User logged in successfully."
        });
    } catch (err) {
        next(err);
    }
}

async function updatePassword(req, res, next) {
    const {password, newPassword} = req.body;
    const token = req.token;
    try {
        const decoded = TokenController.decodeToken(token);
        const user = await User.findByPk(decoded.uid, {include: [Employee, PermissionGroup]});

        const matched = EncryptionController.comparePassword(password, user.password);
        if (!matched) return res.status(401).json({status: "error", data: null, message: "Wrong password"});

        user.password = newPassword;
        await user.save();

        const newToken = TokenController.generateNewToken(user);
        return res.status(200).json({
            status: "success",
            data: {user: user, token: newToken},
            message: "Password updated successfully."
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany, login, updatePassword};

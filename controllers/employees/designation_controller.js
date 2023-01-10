const Employee = require("../../models/employee");
const Designation = require("../../models/designation")
const sequelize = require("../../config/database");

async function insert(req, res, next) {
    const name = req.body.name;
    try {
        if (name === null || name === undefined) {
            return res.status(400).json({status: "error", data: null, message: "Invalid Designation."});
        }
        const designation = await Designation.create({name: name})
        res.status(201).json({status: "success", data: designation, message: "Designation created successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetch(req, res, next) {
    try {
        const designations = await Designation.findAll({
            attributes: ["id", "name", [sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count']],
            include: {
                model: Employee,
                attributes: []
            },
            group: ['id']
        });
        res.status(200).json({status: "success", data: designations, message: "Designations fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const groupId = req.params.id;

    try {
        const designation = await Designation.findByPk(groupId, {include: {model: Employee}});
        res.status(200).json({status: "success", data: designation, message: "Designation fetched successfully."});
    } catch (err) {
        next(err);
    }

}

async function update(req, res) {
    const id = req.params.id;

    try {
        const result = await Designation.update({...req.body},{where:{id:id}});
        res.status(200).json({status: "success", data: result, message: "Designation updated successfully."});
    } catch (error) {
        res.status(404).json({status: "error", data: error, message: "An error occurred"});
    }
}

async function destroy(req, res) {
    const id = req.params.id;
    try {
        await Designation.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "Designation deleted successfully."});
    } catch (error) {
        res.status(500).json({status: "error", data: error, message: "An error occurred"});
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query;

    try {
        await Designation.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "Designations deleted successfully"});
    } catch (e) {
        next(e);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
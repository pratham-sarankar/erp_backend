const sequelize = require("../config/database");
const Employee = require("../models/employee");
const Customer = require("../models/customer");
const Class = require("../models/class");
const Course = require("../models/course");
const Branch = require("../models/branch");

async function insert(req, res, next) {
    const name = req.body.name;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;

    try {
        let branch = await Branch.create({name: name, address: address, phoneNumber: phoneNumber});
        res.status(201).json({status: "success", data: branch, message: "Branch created successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const branchId = req.params.id;
    try {
        let branch = await Branch.findByPk(branchId);
        if (branch == null) return res.status(404).json({status: "error", data: null, message: "Branch doesn't exist"});
        const employeesCount = await Branch.findAll({
            attributes: ["id", [sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count'],],
            include: [{model: Employee, attributes: [],},],
            group: ['id'],
        });
        const customerCounts = await Branch.findAll({
            attributes: ["id", [sequelize.fn('COUNT', sequelize.col('customers.id')), 'customers_count'],],
            include: [{model: Customer, attributes: [],},],
            group: ['id'],
        });
        branch = {...branch.toJSON(), ...customerCounts.find(value => value.id === branch.id).toJSON(), ...employeesCount.find(value => value.id === branch.id).toJSON()};
        return res.status(200).json({status: "success", data: branch, message: "Branch fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetch(req, res, next) {
    try {
        let branches = await Branch.findAll();
        const employeesCount = await Branch.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count'],],
            include: [{model: Employee, attributes: [],},],
            group: ['id'],
        });
        const customerCounts = await Branch.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('customers.id')), 'customers_count'],],
            include: [{model: Customer, attributes: [],},],
            group: ['id'],
        });
        const classesCount = await Branch.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('classes.id')), 'classes_count'],],
            include: [{model: Class, attributes: [],},],
            group: ['id'],
        });
        const coursesCount = await Branch.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('courses.id')), 'courses_count'],],
            include: [{model: Course, attributes: [],},],
            group: ['id'],
        });
        for (let i = 0; i < branches.length; i++) {
            branches[i] = {
                ...branches[i].toJSON(),
                ...employeesCount[i].toJSON(),
                ...customerCounts[i].toJSON(),
                ...classesCount[i].toJSON(),
                ...coursesCount[i].toJSON(),
            };
        }
        return res.status(200).json({status: "success", data: branches, message: "Branches fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    const name = req.body.name;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;

    try {
        const branch = await Branch.findByPk(id);
        if (branch == null) return res.status(404).json({status: "error", data: null, message: "Branch doesn't exist"});
        branch.name = name;
        branch.address = address;
        branch.phoneNumber = phoneNumber;
        await branch.save();
        res.status(200).json({status: "success", data: branch, message: "Branch updated successfully."});
    } catch (err) {
        next(err);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;

    try {
        await Branch.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "Branch deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query;

    try {
        await Branch.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "Branches deleted successfully."});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetch, fetchOne, update, destroy, destroyMany};
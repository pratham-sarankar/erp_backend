const sequelize = require("../config/database");
const Employee = require("../models/employee");
const Customer = require("../models/customer");
const Class = require("../models/class");
const Course = require("../models/course");
const Branch = require("../models/branch");

async function insertOne(req, res) {
    const name = req.body.name;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;

    let branch;
    try {
        branch = await Branch.create({name: name, address: address, phoneNumber: phoneNumber});
    } catch (e) {
        return res.status(500).json({status: "error", data: e, message: "An error occured"});
    }
    res.status(201).json({status: "success", data: branch, message: "Branch created successfully."});
}

async function fetchAll(req, res) {
    let branches;
    try {
        branches = await Branch.findAll();
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
        for (let i = 0; i < branches.length; i++) {
            branches[i] = {...branches[i].toJSON(),...employeesCount[i].toJSON(),...customerCounts[i].toJSON()};
        }
    } catch (e) {
        return res.status(500).json({status: "error", data: e, message: "An error occured"});
    }
    return res.status(200).json({status: "success", data: branches, message: "Branches fetched successfully."});
}

async function fetchOne(req, res) {
    const branchId = req.params.id;
    try {
        const branch = await Branch.findByPk(branchId, {
            attributes: ["id", "name", "address", "phoneNumber", [sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count'], [sequelize.fn('COUNT', sequelize.col('customers.id')), 'customers_count'], [sequelize.fn('COUNT', sequelize.col('classes.id')), 'classes_count'], [sequelize.fn('COUNT', sequelize.col('courses.id')), 'courses_count']],
            include: [{
                model: Employee, attributes: [],
            }, {
                model: Customer, attributes: [],
            }, {
                model: Class, attributes: [],
            }, {
                model: Course, attributes: [],
            },],
            group: ['id'],
        });
        if (branch == null) return res.status(404).json({
            status: "error", data: null, message: "Branch does not exist."
        });
        return res.status(200).json({status: "success", data: branch, message: "Branch fetched successfully."});
    } catch (error) {
        return res.status(500).json({status: "error", data: error, message: "An error occurred"});
    }
}


async function updateOne(req, res) {
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
    } catch (error) {
        res.status(500).json({status: "error", data: error, message: "An error occurred"});
    }
}


async function deleteOne(req, res) {
    const id = req.params.id;
    try {
        await Branch.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "Branch deleted successfully."});
    } catch (error) {
        res.status(500).json({status: "error", data: error, message: "An error occurred"});
    }
}

module.exports = {insertOne, fetchAll, fetchOne, updateOne, deleteOne};
const Employee = require("../../models/employee");
const Designation = require("../../models/designation");
const Branch = require("../../models/branch");


async function insert(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const photoUrl = req.body.photoUrl;
    const idUrl = req.body.idUrl;
    const certUrl = req.body.certUrl;
    const dob = req.body.dob;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;

    const designationId = req.body.designation_id;

    try {

        //At least one of phone number and email is required.
        if (email == null && phoneNumber == null) {
            return res.status(400).json({
                status: "error",
                data: null,
                message: "A unique Email or Phone number is required to register a new employee."
            })
        }

        //Find designation or throw 404 error.
        if (designationId != null) {
            const designation = await Designation.findByPk(designationId);
            if (designation == null) return res.status(404).json({status: "error", data: null, message: "Designation not found"});
        }

        //Created(Built and Saved) the employee in the database.
        const employee = await Employee.create(req.body);

        if (designationId != null) {
            await employee.setDesignation(designationId);
        }

        return res.status(201).json({status: "success", data: employee, message: "Employee created successfully"});

    } catch (error) {
        if (error['name'] === 'SequelizeUniqueConstraintError') {
            const message = `Employee already exist with the given ${error.errors[0].path}.`;
            return res.status(403).json({status: "error", data: null, message: message});
        }
        console.log(error);
        return res.status(500).json({status: "error", data: null, message: error})
    }
}

async function fetchOne(req, res) {
    const id = req.params.id;
    const employee = await Employee.findByPk(id);
    return res.status(200).json({status: "success", data: employee, message: "Employee fetched successfully."});
}


async function fetch(req, res) {
    // Fetch All the employees.
    const employees = await Employee.findAll(req.query);
    // Send the data.
    return res.status(200).json({status: "success", data: employees, message: "Employees fetched successfully."});
}


async function update(req, res) {
    const id = req.params.id;

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const photoUrl = req.body.photoUrl;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const dob = req.body.dob;
    const idUrl = req.body.idUrl;
    const certUrl = req.body.certUrl;
    const designationId = req.body.designation_id;


    const employee = await Employee.findByPk(id).catch(reason => res.status(404).json({
        status: "error",
        data: reason,
        message: "Employee not found"
    }));
    if (employee == null) return;

    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.photoUrl = photoUrl;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.dob = dob;
    employee.idUrl = idUrl;
    employee.certUrl = certUrl;

    try {
        await employee.save();
        await employee.setDesignation(designationId);
    } catch (e) {
        return res.status(500).json({status: "error", data: null, message: e.errors[0].message})
    }
    return res.status(200).json({status: "success", data: employee, message: "Employee updated successfully."});
}

async function destroy(req, res) {
    const id = req.params.id;
    try {
        await Employee.destroy({where: {id: id}})
        return res.status(200).json({status: "success", data: null, message: "Employee deleted successfully."});
    } catch (e) {
        return res.status(500).json({status: "error", data: e, message: "An error occurred"});
    }
}

async function destroyMany(req, res) {
    const ids = req.query.ids;
    try {
        await Employee.destroy({where: {id: ids}})
        return res.status(200).json({status: "success", data: null, message: "Employees deleted successfully."});
    } catch (e) {
        console.log(e);
        return res.status(500).json({status: "error", data: e, message: "An error occurred"});
    }
}


module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
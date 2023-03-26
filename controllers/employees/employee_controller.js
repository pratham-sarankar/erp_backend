const Employee = require("../../models/employee");
const Designation = require("../../models/designation");
const Branch = require("../../models/branch");
const {Op} = require("sequelize");
const Customer = require("../../models/customer");


async function insert(req, res) {
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
            if (designation == null) return res.status(404).json({
                status: "error",
                data: null,
                message: "Designation not found"
            });
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
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");

    //Employees can be searched by the designation.
    //In order to search employees by designation.
    //Designation ID must be known, so, in case, we get the designation_id directly, well n good.
    //We may also get designation key, which is either null or unique for all designations.
    //In case we get designation key, search by key and replace with id

    if(req.query.designation_key){
        const designation = await Designation.findOne({where:{key:req.query.designation_key}});
        delete req.query.designation_key;
        if(designation){
            req.query = {
                ...req.query,
                designation_id:designation.id,
            }
        }else{
            return res.status(200).json({status: "success", data: [], message: "Employees fetched successfully."});
        }
    }

    if(req.query.search){
        const search = req.query.search;
        //Find all customers with the search string in their firstName, lastName, username or phoneNumber
        req.query = {
            [Op.or]: [
                {firstName: {[Op.like]: `%${search}%`}},
                {lastName: {[Op.like]: `%${search}%`}},
                {phoneNumber: {[Op.like]: `%${search}%`}},
                {email: {[Op.like]: `%${search}%`}},
                //Write query for case when search will be firstName lastName
                {
                    [Op.and]: [
                        {firstName: {[Op.like]: `%${search.split(' ')[0]}%`}},
                        {lastName: {[Op.like]: `%${search.split(' ')[1]}%`}},
                    ]
                },
            ],
            ...req.query,
        }
    }
    delete req.query.search;

    let order = [];
    if(req.query.order){
        const orderColumn = req.query.order;
        //Initialize orderDirection to ASC
        let orderDirection = "ASC";
        //If DESC is true, then orderDirection is DESC
        if (req.query.DESC === "true"){
            orderDirection = "DESC";
        }

        if (orderColumn === "full_name"){
            order = [
                ["firstName", orderDirection],
                ["lastName", orderDirection],
            ]
        }else if (orderColumn === "phone_number"){
            order = [
                ["phoneNumber", orderDirection]
            ]
        }else if (orderColumn === "email"){
            order = [
                ["email", orderDirection]
            ]
        }else if (orderColumn === "date_of_birth"){
            order = [
                ["dob", orderDirection]
            ]
        }
    }
    delete req.query.order;
    delete req.query.DESC;


    let employees;
    const withCount = req.query.count;
    delete req.query.count;

    const options = {
            where: req.query,
            limit: limit,
            offset: offset,
            order: order,
            include:{
                model: Designation,
            }
        };

    if(withCount){
        employees = await Employee.findAndCountAll(options);
    }else{
        employees = await Employee.findAll(options);
    }
    return res.status(200).json({status: "success", data: employees, message: "Employees fetched successfully."});
}


async function fetchWithCount(req,res,next){
    req.query.count = true;
    return fetch(req,res,next);
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
    const ids = req.body.ids;
    console.log(ids);
    try {
        await Employee.destroy({where: {id: ids}})
        return res.status(200).json({status: "success", data: null, message: "Employees deleted successfully."});
    } catch (e) {
        console.log(e);
        return res.status(500).json({status: "error", data: e, message: "An error occurred"});
    }
}


module.exports = {insert, fetchOne, fetch, fetchWithCount, update, destroy, destroyMany};
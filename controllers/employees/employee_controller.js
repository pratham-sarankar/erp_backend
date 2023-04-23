const Employee = require("../../models/employee");
const Designation = require("../../models/designation");
const Branch = require("../../models/branch");
const {Op} = require("sequelize");
const Customer = require("../../models/customer");


async function insert(req, res,next) {

    try {

        //Step 1 : If email exist, verify it and check if employee exist with the given email.
        if (req.body.email) {
            const email = req.body.email;
            const employee = await Employee.findOne({where: {email: email}});
            if (employee != null) return res.status(403).json({
                status: "error",
                data: null,
                message: "Employee already exist with the given email."
            });
        }

        //Step 2 : If phone number exist, verify it and check if employee exist with the given phone number.
        if(req.body.phoneNumber){
            const phoneNumber = req.body.phoneNumber;
            const employee = await Employee.findOne({where: {phoneNumber: phoneNumber}});
            if (employee != null) return res.status(403).json({
                status: "error",
                data: null,
                message: "Employee already exist with the given phone number."
            });
        }

        const employee = await Employee.create(req.body);

        return res.status(201).json({status: "success", data: employee, message: "Employee created successfully"});

    } catch (err) {
        next(err);
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

    order = [
        ...order,
        ["createdAt", "DESC"],
    ]


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
    const ids = req.query.ids;

    try {
        await Employee.destroy({where: {id: ids}})
        return res.status(200).json({status: "success", data: null, message: "Employees deleted successfully."});
    } catch (e) {
        console.log(e);
        return res.status(500).json({status: "error", data: e, message: "An error occurred"});
    }
}

async function fetchSummary(req,res){
    const totalEmployees = await Employee.count({
        where: req.query,
    });
    return res.status(200).json({
        status: "success",
        data: {
            total: totalEmployees,
        },
        message: "Summary fetched successfully."
    });
}


module.exports = {insert, fetchOne, fetch, fetchWithCount, update, destroy, destroyMany, fetchSummary};
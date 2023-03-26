const Employee = require("../../models/employee");
const Designation = require("../../models/designation")
const sequelize = require("../../config/database");
const {Op} = require("sequelize");

async function insert(req, res, next) {
    try {
        //Step 1 : Create a designation with the data in the body.
        const designation = await Designation.create(req.body);
        res.status(201).json({status: "success", data: designation, message: "Designation created successfully."});
    } catch (e) {
        next(e);
    }
}

async function fetch(req, res, next) {
    try {

        if(req.query.search){
            const search = req.query.search;
            //Find all customers with the search string in their firstName, lastName, username or phoneNumber
            req.query = {
                [Op.or]: [
                    {name: {[Op.like]: `%${search}%`}},
                ],
                ...req.query,
            }
        }
        delete req.query.search;

        //Step 1 : Query the designations and send the response.
        const designations = await Designation.findAll({
            attributes: ["id", "name", "key", [sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count']],
            where: req.query,
            include: {
                model: Employee,
                attributes: []
            },
            group: ['id']
        });
        res.status(200).json({status: "success", data: designations, message: "Designations fetched successfully."});
    } catch (e) {
        next(e);
    }
}

async function fetchOne(req, res, next) {
    const groupId = req.params.id;

    try {
        //Step 1 : Fetch the designation with the id and send the response.
        const designation = await Designation.findByPk(groupId, {include: {model: Employee}});
        res.status(200).json({status: "success", data: designation, message: "Designation fetched successfully."});
    } catch (e) {
        next(e);
    }

}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        //Step 1 : Update the data and send the response.
        const result = await Designation.update({...req.body}, {where: {id: id}});
        res.status(200).json({status: "success", data: result, message: "Designation updated successfully."});
    } catch (e) {
        next(e);
    }
}

async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        //Step 1 : Fetch the designation by id.
        const designation = await Designation.findByPk(id);
        //Step 2 : If the key is not null abort the operation.
        if (designation.key)
            return res.status(400).json({
                status: "error",
                data: null,
                message: "The requested designation is not deletable."
            })
        //Step 3 : Else delete the designation and send the response.
        await designation.destroy();
        res.status(202).json({status: "success", data: null, message: "Designation deleted successfully."});
    } catch (e) {
        next(e);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        //Step 1 : Fetch all ids where key is not null.
        const designations = await Designation.findAll({where: {[Op.and]: [{key: {[Op.not]: null}}, {id: ids}]}});
        //Step 2 : If any requested designation's key is not null. Abort the operation.
        if (designations.length > 0)
            return res.status(400).json({
                status: "error",
                data: designations,
                message: "One or more requested designations are not deletable."
            });
        //Step 3: Else delete the requested designations and send the response.
        await Designation.destroy({where: {[Op.and]: [{key: {[Op.is]: null}}, {id: ids}]}},);
        res.status(202).json({status: "success", data: designations, message: "Designations deleted successfully"});
    } catch (e) {
        next(e);
    }
}

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
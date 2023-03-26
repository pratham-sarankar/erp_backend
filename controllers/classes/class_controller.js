const Class = require("../../models/class");
const Package = require("../../models/package");
const Employee = require("../../models/employee");
const {Op} = require("sequelize");
const Subscription = require("../../models/subscription");

async function insert(req, res, next) {
    console.log(req.body)
    try {
        const newClass = await Class.create(req.body);
        return res.status(201).json({status: "success", data: newClass, message: "New class created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundClass = await Class.findByPk(id,{include:Package});
        if (foundClass == null) return res.status(404).json({status: "error", data: null, message: "Class not found."});
        return res.status(200).json({status: "success", data: foundClass, message: "Class fetched successfully."});
    } catch (err) {
        return next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        if(req.query.search){
            //Find all classes with title, description, or trainer like search
            req.query = {
                [Op.or]: [
                    {title: {[Op.like]: `%${req.query.search}%`}},
                ],
                ...req.query,
            }
        }
        delete req.query.search;

        //Create order by order paramter in query string, it can be firstName, lastName, username, phoneNumber, createdAt, updatedAt
        let order = [];
        if(req.query.order){
            const orderColumn = req.query.order;
            //Initialize orderDirection to ASC
            let orderDirection = "ASC";
            //If DESC is true, then orderDirection is DESC
            if (req.query.DESC === "true"){
                orderDirection = "DESC";
            }

            if(orderColumn=="title"){
                order = [
                    ["title", orderDirection]
                ]
            }else if (orderColumn === "start_time"){
                order = [
                    ["start_time", orderDirection]
                ]
            }else if (orderColumn === "start_time"){
                order = [
                    ["end_time", orderDirection]
                ]
            }
        }
        delete req.query.order;
        delete req.query.DESC;

        const options = {
                where: req.query,
                limit: limit,
                order: order,
                offset: offset,
                distinct: true,
                include: [
                    {
                        model: Employee,
                        as: 'trainer'
                    },
                    Package,
                ]
            };

        //If count is true, then return count of classes
        let classes;
        const withCount = req.query.count;
        delete req.query.count;
        if (withCount) {
            classes = await Class.findAndCountAll(options);
        }else{
            classes = await Class.findAll(options);
        }
        return res.status(200).json({
            status: "success",
            data: classes,
            message: "Subscriptions fetched successfully."
        });
        return res.status(200).json({status: "success", data: classes, message: "Classes fetched successfully."});
    } catch (err) {
        next(err);
    }
}

function fetchWithCount(req,res,next) {
    req.query.count = true;
    return fetch(req,res,next);
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Class.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Class updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundClass = await Class.findByPk(id);
        if (foundClass == null) return res.status(404).json({status: "error", data: null, message: "Class not found."});
        await foundClass.destroy();
        res.status(200).json({status: "success", data: null, message: "Class deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Class.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Classes deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch,fetchWithCount, update, destroy, destroyMany};
const Course = require("../models/course");
const {Op} = require("sequelize");
const Payment = require("../models/payment");

async function insert(req, res, next) {
    try {
        const newCourse = await Course.create(req.body);
        return res.status(201).json({status: "success", data: newCourse, message: "New course created!"});
    } catch (err) {
        return next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const foundCourse = await Course.findByPk(id);
        if (foundCourse == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Course not found."
        });
        return res.status(200).json({status: "success", data: foundCourse, message: "Course fetched successfully."});
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
            const search = req.query.search;
            req.query = {
                [Op.or]: [
                    {title: {[Op.like]: `%${search}%`}},
                    {description: {[Op.like]: `%${search}%`}},
                    {duration: {[Op.lte]: search}},
                    {price: {[Op.lte]: search}},
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

            if (orderColumn === "title"){
                order = [
                    ["title", orderDirection],
                ]
            }else if (orderColumn === "description"){
                order = [
                    ["description", orderDirection]
                ]
            }else if(orderColumn === "duration"){
                order = [
                    ["duration", orderDirection]
                ]
            }else if(orderColumn=="starting_date"){
                order = [
                    ["starting_date", orderDirection]
                ]
            }else if(orderColumn=="price"){
                order = [
                    ["price", orderDirection]
                ]
            }
        }
        delete req.query.order;
        delete req.query.DESC;


        order = [
            ...order,
            ["createdAt", "DESC"],
        ]

        const options = {
            where: req.query,
            limit:limit,
            offset:offset,
            order:order,
        };

        let courses;
        const withCount = req.query.count;
        delete req.query.count;

        if(withCount){
            courses= await Course.findAndCountAll(options);
        }else{
            courses = await Course.findAll(options);
        }

        return res.status(200).json({status: "success", data: courses, message: "Courses fetched successfully."});
    } catch (err) {
        next(err);
    }
}


async function fetchWithCount(req,res,next){
    req.query.count = true;
    return fetch(req,res,next);
}


async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Course.update(req.body, {where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Course updated successfully"});
    } catch (e) {
        next(e);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        const foundCourse = await Course.findByPk(id);
        if (foundCourse == null) return res.status(404).json({
            status: "error",
            data: null,
            message: "Course not found."
        });
        await foundCourse.destroy();
        res.status(200).json({status: "success", data: null, message: "Course deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Course.destroy({where: {id: ids}});
        res.status(200).json({status: "success", data: null, message: "Courses deleted successfully"});
    } catch (err) {
        next(err);
    }

}

module.exports = {insert, fetchOne, fetch,fetchWithCount, update, destroy, destroyMany};
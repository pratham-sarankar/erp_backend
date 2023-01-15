const Course = require("../models/course");

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
        const classes = await Course.findAll(
            {
                where: req.query,
                limit:limit,
                offset:offset,
            },
        );
        return res.status(200).json({status: "success", data: classes, message: "Courses fetched successfully."});
    } catch (err) {
        next(err);
    }
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

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
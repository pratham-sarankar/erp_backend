const Class = require("../../models/class");
const Package = require("../../models/package");
const Employee = require("../../models/employee");

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
        const classes = await Class.findAll(
            {
                where: req.query,
                limit: limit,
                offset: offset,
                include: [
                    {
                        model: Employee,
                        as: 'trainer'
                    },
                    {
                        model: Package,
                    }
                ]
            },
        );
        return res.status(200).json({status: "success", data: classes, message: "Classes fetched successfully."});
    } catch (err) {
        next(err);
    }
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

module.exports = {insert, fetchOne, fetch, update, destroy, destroyMany};
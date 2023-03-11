const sequelize = require("../config/database");
const CallLog = require("../models/call_log");
const {DataTypes} = require("sequelize");

async function insert(req, res, next) {
    const data = req.body;
    try {
        let branch = await CallLog.create({
            from: data.participants[0].participantAddress,
            to: data.participants[1].participantAddress,
            type: data.callType,
            status: data.Overall_Call_Status,
            date:data.Date,
            time: data.Time,
            duration: data.duration,
            recordingUrl: data.Recording,
        });
        res.status(201).json({status: "success", data: branch, message: "Call log created successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const callLogId = req.params.id;
    try {
        let callLog = await CallLog.findByPk(callLogId);
        if (callLog == null) return res.status(404).json({status: "error", data: null, message: "Call log doesn't exist"});
        return res.status(200).json({status: "success", data: callLog, message: "Call log fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function fetch(req, res, next) {
    try {
        let callLogs = await CallLog.findAll();
        return res.status(200).json({status: "success", data: callLogs, message: "Call logs fetched successfully."});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        await CallLog.update(req.body,{where:{id:id}});
        res.status(200).json({status: "success", data: null, message: "Call log updated successfully."});
    } catch (err) {
        next(err);
    }
}


async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        await CallLog.destroy({where: {id: id}});
        res.status(202).json({status: "success", data: null, message: "Call log deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query;
    
    try {
        await CallLog.destroy({where: {id: ids}});
        res.status(202).json({status: "success", data: null, message: "Call logs deleted successfully."});
    } catch (err) {
        next(err);
    }
}

module.exports = {insert, fetch, fetchOne, update, destroy, destroyMany};
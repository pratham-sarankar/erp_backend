const sequelize = require("../config/database");
const CallLog = require("../models/call_log");
const Branch = require("../models/branch");
const Customer = require("../models/customer");
const {DataTypes} = require("sequelize");

async function insert(req, res, next) {
    const callType = req.body.callType;
    const participants = req.body.participants;

    let from;
    if(participants[0]){
        from = req.body.participants[0].participantAddress;
    }

    let to;
    if(participants[1]){
        to = req.body.participants[1].participantAddress;
    }
    const customerPhoneNumber = callType=="INBOUND"? from : to;
    const branchPhoneNumber = callType=="INBOUND" ? to : from;
    console.log(customerPhoneNumber);
    console.log(branchPhoneNumber);

    let branchId;
    if(branchPhoneNumber){
        const branch = await Branch.findOne({where:{phoneNumber:branchPhoneNumber}});
        if(branch){
            branchId = branch.id;
        }
    }

    let customerId;
    if(customerPhoneNumber){
        const customer = await Customer.findOne({where:{phoneNumber:customerPhoneNumber}});
        if(customer){
            customerId = customer.id;
        }
    }

    let date;
    if(req.body.Date){
        const parts = req.body.Date.split('/');
        date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    try {
        let branch = await CallLog.create({
            customer_phone_number: customerPhoneNumber,
            branch_phone_number: branchPhoneNumber,
            type: callType,
            status: req.body.Overall_Call_Status,
            date: date,
            time: req.body.Time,
            duration: req.body.Billable_Duration,
            recordingUrl: req.body.Recording,
            branch_id: branchId,
            customer_id: customerId,
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
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        let callLogs = await CallLog.findAll({
            where: req.query,
            limit: limit,
            offset: offset,
            include: Customer,
        });
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
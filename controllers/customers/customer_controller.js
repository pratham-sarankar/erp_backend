const Customer = require("../../models/customer");
const TokenController = require("../token_controller");
const EncryptionController = require('../encryption_controller');

async function insert(req, res, next) {
    try {
        await Customer.create(req.body);
        return res.status(201).json({status: "success", data: null, message: "Customer created successfully"});
    } catch (err) {
        next(err);
    }
}

async function fetchOne(req, res, next) {
    const id = req.params.id;
    try {
        const customer = await Customer.scope('excludePassword').findByPk(id);
        if (customer == null) return res.status(404).json({status: "error", data: null, message: "Customer not found"});
        return res.json({status: "success", data: customer, message: "Customer fetched successfully"});
    } catch (err) {
        next(err);
    }
}

async function fetch(req, res, next) {
    const limit = parseInt(req.headers.limit ?? "100");
    const offset = parseInt(req.headers.offset ?? "0");
    try {
        const customers = await Customer.scope("excludePassword").findAll(
            {
                where: req.query,
                limit:limit,
                offset:offset,
            },
        );
        return res.status(200).json({status: "success", data: customers, message: "Customers fetched successfully"});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Customer.scope("excludePassword").update(req.body, {where: {id: id}});
        return res.status(200).json({status: "success", data: null, message: "Customers updated successfully"});
    } catch (err) {
        next(err);
    }
}

async function destroy(req, res, next) {
    const id = req.params.id;
    try {
        await Customer.destroy({where: {id: id}});
        res.status(200).json({status: "success", data: null, message: "Customer deleted successfully."});
    } catch (err) {
        next(err);
    }
}

async function destroyMany(req, res, next) {
    const ids = req.query.ids;
    try {
        await Customer.destroy({where: {id: ids}})
        return res.status(200).json({status: "success", data: null, message: "Customers deleted successfully."});
    } catch (err) {
        next(err);
    }
}

//User routes
async function loginWithEmailAndPassword(req, res, next) {
    const email = req.body.email;
    try {
        const customer = await Customer.findOne({where: {email: email,}});
        if (customer == null) return res.status(404).json({status: "error", data: null, message: "User not found"});
        return login(customer, req, res, next);
    } catch (err) {
        next(err);
    }
}

async function loginWithPhoneNumber(req, res, next) {
    const phoneNumber = req.body.email;
    try {
        const customer = await Customer.findOne({where: {phoneNumber: phoneNumber,}});
        if (customer == null) return res.status(404).json({status: "error", data: null, message: "User not found"});
        return login(customer, req, res, next);
    } catch (err) {
        next(err);
    }
}

async function login(customer, req, res, next) {
    try {
        const matched = EncryptionController.comparePassword(password, customer.password);
        if (!matched) return res.status(401).json({status: "error", data: null, message: "Incorrect password"});
        //Generate new token for the customer.
        const token = TokenController.generateNewToken(customer);

        delete customer.dataValues.password;
        return res.status(200).json({
            status: "success",
            data: {customer: customer, token: token},
            message: "Login successful"
        });
    } catch (err) {
        next(err);
    }
}


module.exports = {
    insert,
    fetchOne,
    fetch,
    update,
    destroy,
    destroyMany,
    loginWithEmailAndPassword,
    loginWithPhoneNumber
};
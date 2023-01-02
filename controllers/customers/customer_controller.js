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
        return res.json({status: "success", data: {customer: customer}, message: "Customer fetched successfully"});
    } catch (err) {
        next(err);
    }
}

async function fetchAll(req, res, next) {
    try {
        const customers = await Customer.scope("excludePassword").findAll(req.query);
        return res.status(200).json({status: "success", data: customers, message: "Customers fetched successfully"});
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    const id = req.params.id;
    try {
        await Customer.update(req.body, {where: {id: id}});
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
async function login(req, res,next) {
    try {
        const customer = await Customer.findOne({where: {phoneNumber:req.body.phoneNumber}});
        if (customer == null) return res.status(404).json({status: "error", data: null, message: "User not found"});

        const matched = EncryptionController.comparePassword(req.body.password, customer.password);
        if (!matched) return res.status(401).json({status: "error", data: null, message: "Incorrect password"});

        //Generate new token for the customer.
        const token = TokenController.generateNewToken(customer);

        return res.status(200).json({
            status: "success",
            data: {customer: customer.scope("excludePassword"), token: token},
            message: "Login successful"
        });

    } catch (err) {
        next(err);
    }
}


async function updateDetails(req, res) {
    const decoded = TokenController.decodeToken(req.token);
    console.log(decoded);

    //Fetching customer with the uid found in the token.
    const customer = await Customer.findByPk(decoded.uid);

    if (customer == null) {
        return res.status(404).json({status: "error", data: null, message: "Customer not found"});
    }

    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.username = req.body.username;
    customer.email = req.body.email;
    customer.phoneNumber = req.body.phoneNumber;
    //Updating the password.
    await customer.save();

    return res.status(200).json({status: "success", data: null, message: "Details updated successfully."});
}

async function updatePassword(req, res) {
    const decoded = TokenController.decodeToken(req.token);
    console.log(decoded);

    //Fetching customer with the uid found in the token.
    const customer = await Customer.findByPk(decoded.uid);

    if (customer == null) {
        return res.status(404).json({status: "error", data: null, message: "User not found"});
    }
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const matched = EncryptionController.comparePassword(password, customer.password);

    if (!matched) {
        return res.status(401).json({status: "error", data: null, message: "Incorrect Password!"})
    }

    //Updating the password.
    customer.password = EncryptionController.encryptPassword(newPassword);
    await customer.save();

    return res.status(200).json({status: "success", data: null, message: "Password updated successfully."});
}


module.exports = {insert, fetchOne, fetchAll, update, destroy, destroyMany, login, updatePassword, updateDetails};
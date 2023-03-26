const Customer = require("../../models/customer");
const TokenController = require("../token_controller");
const EncryptionController = require('../encryption_controller');
const Subscription  = require("../../models/subscription");
const Payment = require("../../models/payment");
const Package = require("../../models/package");
const Class = require("../../models/class");
const {Op} = require("sequelize");

async function insert(req, res, next) {
    try {
        const data = await Customer.create(req.body);
        return res.status(201).json({status: "success", data: data, message: "Customer created successfully"});
    } catch (err) {
        next(err);
    }
}

async function register(req, res, next) {
    try {
        const data = await Customer.create(req.body);
        const token = await TokenController.generateNewToken(data);
        return res.status(201).json({
            status: "success",
            data: {token: token, customer: data},
            message: "Customer registered successfully"
        });
    } catch (err) {
        next(err);
    }
}


async function fetchMe(req, res, next) {
    const decoded = TokenController.decodeToken(req.token);
    const id = decoded.uid;
    try {
        const customer = await Customer.scope('excludePassword').findByPk(id);
        if (customer == null) return res.status(404).json({status: "error", data: null, message: "Customer not found"});
        return res.json({status: "success", data: customer, message: "Customer fetched successfully"});
    } catch (err) {
        next(err);
    }
}

async function fetchMySubscription(req,res,next){
    const decoded = TokenController.decodeToken(req.token);
    const id = decoded.uid;
    console.log(id);
    try{
        const subscriptions = await Subscription.findAll({where:{customer_id:id},include:{model:Package,include:Class}});
        return res.json({status:"success",data:subscriptions,message:"Subscriptions fetched successfully"});
    }catch(err){
        next(err);
    }
}

async function fetchMyPayments(req,res,next){
    const decoded = TokenController.decodeToken(req.token);
    const id = decoded.uid;
    try{
        const payments = await Payment.findAll({where:{customer_id:id}});
        return res.json({status:"success",data:payments,message:"Payments fetched successfully."});
    }catch(err){
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
        if(req.query.search){
            const search = req.query.search;
            //Find all customers with the search string in their firstName, lastName, username or phoneNumber
            req.query = {
                [Op.or]: [
                    {firstName: {[Op.like]: `%${search}%`}},
                    {lastName: {[Op.like]: `%${search}%`}},
                    {username: {[Op.like]: `%${search}%`}},
                    {phoneNumber: {[Op.like]: `%${search}%`}},
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

            if(orderColumn=="username"){
                order = [
                    ["username", orderDirection]
                ]
            }
            else if (orderColumn === "full_name"){
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

        let customers;
        const withCount = req.query.count;
        delete req.query.count;


        order = [
            ...order,
            ['createdAt', 'DESC']
        ]

        const options = {
            where: req.query,
            limit: limit,
            offset: offset,
            order: order,
            distinct: true,
        };

        if(withCount){
            customers = await Customer.scope("excludePassword").findAndCountAll(options);
        }else{
            customers = await Customer.scope("excludePassword").findAll(options);
        }

        return res.status(200).json({status: "success", data: customers, message: "Customers fetched successfully"});
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
    const password = req.body.password;
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
    fetchMe,
    fetchOne,
    fetch,
    fetchWithCount,
    update,
    destroy,
    destroyMany,
    loginWithEmailAndPassword,
    loginWithPhoneNumber,
    register,
    fetchMyPayments,
    fetchMySubscription
};
const Customer = require("../models/customer");
const TokenController = require("./token_controller");
const EncryptionController = require('./encryption_controller');


async function register(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const photoUrl = req.body.photoUrl;
    let password = req.body.password;

    try {

        //Encrypt the password.
        password = EncryptionController.encryptPassword(password);

        //Check if Email and PhoneNumber, all are null. Because, at least one of them is required.
        if(email==null&&phoneNumber==null){
            return res.status(400).json({
                status:"error",
                data:null,
                message:"A unique Email or Phone number is required to register a new customer."
            })
        }

        //Created(Built and Saved) the customer in the database.
        const customer = await Customer.create({
            firstName:firstName,
            lastName:lastName,
            username: username,
            email: email,
            photoUrl:photoUrl,
            phoneNumber: phoneNumber,
            password: password,
        });

        //Generating new token for the customer.
        const token = TokenController.generateNewToken(customer);

        //Delete password field from the customer object
        delete customer.dataValues.password;
        return res.status(201).json({ status: "success", data: { customer: customer, token: token }, message: "Customer created successfully" });

    } catch (error) {
        if (error['name'] === 'SequelizeUniqueConstraintError') {
            const message = `Customer already exist with the given ${error.errors[0].path}.`;
            return res.status(403).json({ status: "error", data: null, message: message });
        }
        return res.status(500).json({ status: "error", data: null, message: error })
    }
}

async function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    console.log(email);
    try {
        //Find customer with the given username.
        const customer = await Customer.findOne(
            { where: { email: email } },
        );
        console.log(customer);

        if (customer == null) {
            return res.status(404).json({ status: "error", data: null, message: "customer not found" });
        }

        //Matching password
        const matched = EncryptionController.comparePassword(password, customer.password);
        if (!matched) {
            return res.status(401).json({ status: "error", data: null, message: "Incorrect Password" });
        }

        //Generate new token for the customer.
        const token = TokenController.generateNewToken(customer);

        //Delete password field from the customer object
        delete customer.dataValues.password;
        return res.status(200).json({ status: "success", data: { customer: customer, token: token }, message: "Login successful" });

    } catch (error) {
        return res.status(501).json({ status: "error", data: null, message: error });
    }

}

async function fetchOne(req,res){

    const decoded = TokenController.decodeToken(req.token);

    //Fetching customer with the uid found in the token.
    const customer = await Customer.findByPk(decoded.uid);

    if (customer == null) {
        return res.status(404).json({ status: "error", data: null, message: "Customer not found" });
    }

    //Delete password field from the customer object
    delete customer.dataValues.password;
    res.json({status:"success", data:{customer:customer}, message:"Customer fetched successfully"});
}

async function updatePassword(req,res){
    const decoded = TokenController.decodeToken(req.token);
    console.log(decoded);

    //Fetching customer with the uid found in the token.
    const customer = await Customer.findByPk(decoded.uid);

    if(customer == null){
        return res.status(404).json({status:"error",data:null,message:"Customer not found"});
    }

    let password = req.body.password;
    customer.password = EncryptionController.encryptPassword(password);

    //Updating the password.
    await customer.save();

    return res.status(400).json({status:"success",data:null,message:"Password updated successfully."});
}

module.exports = { register, login, fetchOne,updatePassword }
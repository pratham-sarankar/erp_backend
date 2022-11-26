const User = require("../models/user");
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
                message:"A unique Email or Phone number is required to register a new user."
            })
        }

        //Created(Built and Saved) the user in the database.
        const user = await User.create({
            firstName:firstName,
            lastName:lastName,
            username: username,
            email: email,
            photoUrl:photoUrl,
            phoneNumber: phoneNumber,
            password: password,
        });

        //Generating new token for the user.
        const token = TokenController.generateNewToken(user);

        //Deleted password from user. We don't want to send password to the front-end.
        delete user.password;
        return res.status(201).json({ status: "success", data: { user: user, token: token }, message: "User created successfully" });

    } catch (error) {
        if (error['name'] === 'SequelizeUniqueConstraintError') {
            const message = `User already exist with the given ${error.errors[0].path}.`;
            return res.status(403).json({ status: "error", data: null, message: message });
        }
        return res.status(500).json({ status: "error", data: null, message: error })
    }
}

async function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    try {
        //Find user with the given username.
        const user = await User.findOne(
            { where: { email: email } },
        );

        if (user == null) {
            return res.status(404).json({ status: "error", data: null, message: "User not found" });
        }

        //Matching password
        const matched = EncryptionController.comparePassword(password, user.password);
        if (!matched) {
            return res.status(401).json({ status: "error", data: null, message: "Incorrect Password" });
        }

        //Generate new token for the user.
        const token = TokenController.generateNewToken(user);
        return res.status(200).json({ status: "success", data: { user: user, token: token }, message: "Login successful" });

    } catch (error) {
        return res.status(501).json({ status: "error", data: null, message: error });
    }

}

async function fetchOne(req,res){


}

module.exports = { register, login, fetchOne }
const User = require("../models/user");
const TokenController = require("./token_controller");
const EncryptionController = require('./encryption_controller');

async function fetchAll(req,res){
    //1. Only if token is verified this method should run, i.e., verify token as a middleware.
    //2. Fetch all the users from the database.
    //3. Send the data of all the users.

    //2
    const users = await User.scope('withoutPassword').findAll();

    //3
    return res.status(200).json({status:"success",data:users,message:"Users fetched successfully."});
}

async function fetchOne(req,res){
    //1. Only if token is verified this method should run, i.e., verify token as a middleware.
    //2. The decoded token will have the user id of the current user, use it to find the User.
    //3. If the user found is null then throw 404 not found error.
    //4. Else, delete the password field from user model.
    //5. Send the user details.

    //1
    const decoded = TokenController.decodeToken(req.token);

    //2
    const user = await User.findByPk(decoded.uid);

    //3
    if (user == null) {
        return res.status(404).json({ status: "error", data: null, message: "User not found" });
    }

    //4
    delete user.dataValues.password;

    //5
    res.json({status:"success", data:{user:user}, message:"User fetched successfully"});
}

async function register(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const photoUrl = req.body.photoUrl;
    const idUrl = req.body.idUrl;
    const certUrl = req.body.certUrl;
    const dob = req.body.dob;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    let password = req.body.password;

    try {
        //Encrypt the password.
        password = EncryptionController.encryptPassword(password);

        //Check if both Email and PhoneNumber are null. At least one of them is required.
        if(email==null&&phoneNumber==null){
            return res.status(400).json({
                status:"error",
                data:null,
                message:"A unique Email or Phone number is required to register a new user."
            })
        }

        //Created(Built and Saved) the user in the database.
        const user = await User.create({
            firstName :  firstName,
            lastName : lastName,
            username :  username,
            photoUrl : photoUrl,
            idUrl :  idUrl,
            certURl :  certUrl,
            dob :  dob,
            email :  email,
            phoneNumber :  phoneNumber,
            password : password,
        });

        //Generating new token for the user.
        const token = TokenController.generateNewToken(user);

        //Delete password field from the user object
        delete user.dataValues.password;
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
    //1. If the email is not null, we will find the user with the email.
    //2. If the user not found with the email and the username is provided, we will search the user with the username.
    //3. If we still don't have the user means the user doesn't exist and we must terminate the process.
    //4. Else if the user is found by any resource(email or username). Then we must verify the password.
    //5. If the password doesn't match, we must terminate the process. Else the user is authentic, and must be provided it with a token.
    //6. So generate a new token.
    //7. Delete the password field from the user object.
    //8. Send the user data with the status success and an appropriate message.
    //9. Finally, try and catch any error and send the null data with the status error and an appropriate message.
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    try {
        //1
        let user;
        if (email!=null){
            user = await User.findOne(
                { where: { email: email } },
            );
        }
        //2
        if (user==null&&username!=null){
            user = await User.findOne({ where: {username:username}});
        }

        //3
        if(user==null){
            return res.status(404).json({ status: "error", data: null, message: "User not found" });
        }

        //4
        const matched = EncryptionController.comparePassword(password, user.password);

        //5
        if (!matched) {
            return res.status(401).json({ status: "error", data: null, message: "Incorrect Password" });
        }

        //6
        const token = TokenController.generateNewToken(user);

        //7
        delete user.dataValues.password;

        //8
        return res.status(200).json({ status: "success", data: { user: user, token: token }, message: "Login successful" });

    } catch (error) {
        //9
        return res.status(501).json({ status: "error", data: null, message: error });
    }
}




module.exports = {fetchOne,fetchAll,register,login};
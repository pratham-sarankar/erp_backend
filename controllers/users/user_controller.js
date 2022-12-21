const User = require("../../models/user");
const Employee = require("../../models/employee");
const EncryptionController = require("../encryption_controller");
const UserGroup = require("../../models/user_group");
const sequelize = require("../../config/database");

async function insertOne(req,res){
    const username = req.body.username;
    let password = req.body.password;
    const employeeId = req.body.employee_id;

    try{
        //Find the employee or throw 404 error.
        const employee = await Employee.findByPk(employeeId);
        if(employee==null){
            return res.status(404).json({status:"error",data:null,message:"Employee not found"});
        }

        //Encrypt the password
        password = EncryptionController.encryptPassword(password);

        //Create a new user.
        const user = await User.create({username:username, password:password});
        user.setEmployee(employee);
        await user.save();


        res.status(201).json({status:"success",data:user,message:"User created successfully."});
    }catch (e) {
        const message = e.errors[0].message??"An error occurred";
        res.status(500).json({status:"error",data:e,message:message});
    }
}


async function fetchAll(req,res){
    let users;
    try{
        users = await User.findAll();
        res.status(200).json({status:"success",data:users,message:"Users fetched successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
}

async function fetchOne(req,res){
    let user;
    try{
        const id = req.params.id;
        user = await User.findByPk(id);
        if(user==null){
            return res.status(404).json({status:"error",data:user,message:"User not found"});
        }
        res.status(200).json({status:"success",data:user,message:"User fetched successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occurred"});
    }
}

async function updateOne(req,res){
    const username = req.body.username;
    const id = req.body.id;
    let user;
    try{
        user = await User.findByPk(id);
        if(user==null){
            return res.status(404).json({status:"error",data:user,message:"User not found."});
        }
        user.username = username;
        await user.save();
        return res.status(200).json({status:"success",data:user,message:"User updated successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occurred"});
    }
}

module.exports = {insertOne,fetchAll,fetchOne};
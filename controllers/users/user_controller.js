const User = require("../../models/user");
const Employee = require("../../models/employee");
const EncryptionController = require("../encryption_controller");
const TokenController = require("../token_controller");
const UserGroup = require("../../models/user_group");

async function login(req,res){
    const username =req.body.username;
    const password = req.body.password;

    try{
        const user = await User.findOne({where:{username:username},include:Employee});
        if(user==null) return res.status(404).json({status:"error",data:null,message:"User not found"});

        const matched = EncryptionController.comparePassword(password,user.password);
        if(!matched) return res.status(400).json({status:"error",data:null,message:"Incorrect password."});

        const token = TokenController.generateNewToken(user);
        return res.status(200).json({status:"success",data:{user:user,token:token},message:"User logged in successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:null,message:"An error occurred."});
    }
}

async function insertOne(req,res){
    const username = req.body.username;
    let password = req.body.password;
    const employeeId = req.body.employee_id;
    const groupId = req.body.group_id;

    try{
        //Find the employee or throw 404 error.
        const employee = await Employee.findByPk(employeeId);
        const group = await UserGroup.findByPk(groupId);
        if(employee==null){
            return res.status(404).json({status:"error",data:null,message:"Employee not found"});
        }
        if(group==null){
            return res.status(404).json({status:"error",data:null,message:"User group not found"});
        }

        //Encrypt the password
        password = EncryptionController.encryptPassword(password);

        //Create a new user.
        const user = await User.create({username:username, password:password});
        user.setEmployee(employee);
        user.setUser_group(group);
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
        users = await User.scope('withoutPassword').findAll({include:Employee});
        res.status(200).json({status:"success",data:users,message:"Users fetched successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
}

async function fetchOne(req,res){
    let user;
    try{
        const id = req.params.id;
        user = await User.scope('withoutPassword').findByPk(id,{include:Employee});
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
    const groupId = req.body.group_id;
    let password = req.body.password;
    const id = req.params.id;
    let user;
    try{
        user = await User.findByPk(id);
        if(user==null){
            return res.status(404).json({status:"error",data:user,message:"User not found."});
        }
        if(groupId!=null){
            user.setUser_group(groupId);
        }
        if(username!=null){
            user.username = username;
        }
        if(password!=null){
            password = EncryptionController.encryptPassword(password);
            user.password = password;
        }
        await user.save();
        return res.status(200).json({status:"success",data:user,message:"User updated successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occurred"});
    }
}

async function deleteOne(req,res){
    const id = req.params.id;
    let user;
    try{
        user = await User.findByPk(id);
        if(user==null){
            return res.status(404).json({status:"error",data:user,message:"User not found."});
        }
        await user.destroy();
        return res.status(200).json({status:"success",data:null,message:"User deleted successfully."});
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occurred"});
    }
}


module.exports = {login,insertOne,fetchAll,fetchOne,updateOne,deleteOne};
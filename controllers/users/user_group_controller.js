const User = require("../../models/user");
const UserGroup = require("../../models/user_group")
const sequelize = require("../../config/database");

async function insertOne(req,res){
    const name = req.body.name;
    let userGroup;
    try {
        userGroup = await UserGroup.create({name: name})
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
    res.status(201).json({status:"success",data:userGroup,message:"User group created successfully."});
}

async function fetchAll(req,res){
    let userGroups;
    try{
        userGroups = await UserGroup.findAll({
            attributes: ["id","name",[sequelize.fn('COUNT', sequelize.col('users.id')), 'users_count']],
            include: {
                model: User,
                attributes:[]
            },
            group: ['id']
        });
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
    res.status(200).json({status:"success",data:userGroups,message:"User groups fetched successfully."});
}

async function fetchOneWithUsers(req,res){
    const groupId = req.params.id;

    try{
        const userGroup = await UserGroup.findByPk(groupId,{include:{model:User}});
        console.log(userGroup);
        res.status(200).json({status:"success",data:userGroup,message:"User group fetched successfully."});
    }catch (error) {
        console.log(error);
        res.status(404).json({status:"error",data:error,message:"An error occurred"});
    }

}

async function updateOne(req,res){
    const id = req.params.id;
    const name = req.body.name;

    try{
        const group = await UserGroup.findByPk(id);
        if(group==null)res.status(404).json({status:"error",data:null,message:"User group doesn't exist."});
        group.name = name;
        await group.save();
        res.status(200).json({status:"success",data:group,message:"User group updated successfully."});
    }catch (error) {
        res.status(500).json({status:"error",data:error,message:"An error occurred"});
    }
}

async function deleteOne(req,res){
    const id = req.params.id;
    try{
        await UserGroup.destroy({where:{id:id}});
        res.status(202).json({status:"success",data:null,message:"User group deleted successfully."});
    }catch (error) {
        res.status(500).json({status:"error",data:error,message:"An error occurred"});
    }
}

module.exports = {insertOne,fetchAll,fetchOneWithUsers,updateOne,deleteOne};
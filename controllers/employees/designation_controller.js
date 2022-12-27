const Employee = require("../../models/employee");
const Designation = require("../../models/designation")
const sequelize = require("../../config/database");

async function insertOne(req,res){
    const name = req.body.name;
    let designation;
    try {
        if(name===null||name===undefined){
            return res.status(400).json({status:"error",data:null,message:"Invalid Designation."});
        }
        designation = await Designation.create({name: name})
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
    res.status(201).json({status:"success",data:designation,message:"Designation created successfully."});
}

async function fetchAll(req,res){
    let designations;
    try{
        designations = await Designation.findAll({
            attributes: ["id","name",[sequelize.fn('COUNT', sequelize.col('employees.id')), 'employees_count']],
            include: {
                model: Employee,
                attributes:[]
            },
            group: ['id']
        });
    }catch (e) {
        return res.status(500).json({status:"error",data:e,message:"An error occured"});
    }
    res.status(200).json({status:"success",data:designations,message:"Designations fetched successfully."});
}

async function fetchOneWithEmployees(req,res){
    const groupId = req.params.id;

    try{
        const designation = await Designation.findByPk(groupId,{include:{model:Employee}});
        console.log(designation);
        res.status(200).json({status:"success",data:designation,message:"Designation fetched successfully."});
    }catch (error) {
        res.status(404).json({status:"error",data:error,message:"An error occurred"});
    }

}

async function updateOne(req,res){
    const id = req.params.id;
    const name = req.body.name;

    try{
        const designation = await Designation.findByPk(id);
        designation.name = name;
        await designation.save();
        res.status(200).json({status:"success",data:designation,message:"Designation updated successfully."});
    }catch (error) {
        res.status(404).json({status:"error",data:error,message:"An error occurred"});
    }
}

async function deleteOne(req,res){
    const id = req.params.id;
    try{
        await Designation.destroy({where:{id:id}});
        res.status(202).json({status:"success",data:null,message:"Designation deleted successfully."});
    }catch (error) {
        res.status(500).json({status:"error",data:error,message:"An error occurred"});
    }
}

module.exports = {insertOne,fetchAll,fetchOneWithEmployees,updateOne,deleteOne};
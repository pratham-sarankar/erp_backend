const Tag = require("../../models/tag");
const Class = require("../../models/class");
const sequelize = require("../../config/database");

async function fetchOne(req,res){
    const id = req.params.id;
    try{
        const tag = await Tag.findByPk(id,{include:Class});
        res.status(200).json({status:"success",data:tag,message:"Tag fetched successfully."});
    } catch (e) {
        return res.status(500).json({status:"error",data:null,message:"An error occurred"})
    }

}

async function fetchAll(req,res){
    let tags;
    try{
        tags =  await Tag.findAll();
    }catch (e) {
        return res.status(500).json({status:"error",data:null,message:"An error occurred."});
    }
    return res.status(200).json({status:"success",data:tags,message:"Tags fetched successfully."});
}

async function insertOne(req,res) {
    const name = req.body.name;

    try{
        const tag = await Tag.create({name:name});
        res.status(201).json({
            status:"success",
            data: tag,
            message:"New tag created!"
        })
    }catch (e) {
        res.status(500).json({status:"error",data:null,message:"Tag already exist with this name."})
    }

}


module.exports = {fetchOne, fetchAll,insertOne};
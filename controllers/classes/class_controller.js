const Tag = require("../../models/tag");
const Class = require("../../models/class");

async function fetchAll(req,res){
    const classes =  await Class.findAll({include:Tag}).catch(reason => res.status(500).json({status:"error",data:null,message:"An error occurred"}));
    if(classes==null)return;
    res.status(200).json({status:"success",data:classes,message:"Classes fetched successfully."});
}

async function insertOne(req,res) {
    const title = req.body.title;
    const description = req.body.description;

    const newClass = await Class.create({
        title: title,
        description: description,
    });
    res.status(201).json({
        status:"success",
        data: newClass,
        message:"New class created!"
    })
}

async function addTag(req,res){
    const tagId = req.body.tagId;
    const classId = req.body.classId;

    const tag = await Tag.findByPk(tagId).catch(reason => res.status(404).json({status:"error",data:null,message:"Tag not found"}));
    if(tag==null)return;

    const foundClass = await Class.findByPk(classId).catch(reason => res.status(404).json({status:"error",data:null,message:"Class not found"}));
    if(foundClass==null)return;

    await foundClass.addTag(tag);
    res.status(200).json({status:"success",data:tag,message:""});
}

module.exports = {fetchAll,insertOne,addTag};
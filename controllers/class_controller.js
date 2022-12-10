const Tag = require("../models/tag");
const Class = require("../models/class");

async function fetchAll(req,res){
    const classes =  await Class.findAll({include:Tag});
    res.status(200).json({status:"success",data:classes,message:"Classes fetched successfully."});
}

async function insertOne(req,res) {
    const title = req.body.title;
    const description = req.body.description;
    const tags = req.body.tags;
    console.log(tags);

    //Creating the tags or updating in case of its duplicate.
    await Tag.bulkCreate(tags,{updateOnDuplicate:["updatedAt"]});

    // While creating the tags it returns the data of created tags, but the documentation says that it
    // isn't sure that the ids of those models will be retrieved. So it suggests us to query for the tags
    // after creating them.
    const data = await Tag.findAll({ where: {}})

    const newClass = await Class.create({
        title: title,
        description: description,
    });
    await newClass.addTag(data);
    res.status(201).json({
        status:"success",
        data: data,
        message:"New class created!"
    })
}

module.exports = {fetchAll,insertOne};
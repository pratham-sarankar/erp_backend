const {Enquiry} = require("../models");

async function insertOne(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    try{
        //Created(Built and Saved) an enquiry in the database.
        await Enquiry.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            subject:subject,
            message:message,
        });
        return res.json({status:"success",data:null,message:"Enquiry made successfully."});

    } catch (err) {
        return res.json({status:"error",data:null,message:"There is a pending enquiry with this email."})
    }
}

module.exports = {insertOne};
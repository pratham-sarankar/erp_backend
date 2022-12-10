const Product = require("../models/product");

async function fetchAll(req,res){
    const products =  await Product.findAll();
    res.status(200).json({status:"success",data:products,message:"Products fetched successfully."});
}

async function insertOne(req,res){
    res.json({message:"added"});
}

module.exports = {fetchAll,insertOne};
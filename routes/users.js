const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users/user_controller");


router.post("/",async function(req,res){
    return await UserController.insertOne(req,res);
});

router.get("/all",async (req,res)=>{
    return await UserController.fetchAll(req,res);
});

router.get("/:id",async (req, res) => {
    return await UserController.fetchOne(req,res);
});

router.put("/:id",async (req,res)=>{
    return await UserController.updateOne(req,res);
});

router.delete("/:id",async (req,res)=>{
    return await UserController.deleteOne(req,res);
});


module.exports = router;
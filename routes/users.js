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



module.exports = router;
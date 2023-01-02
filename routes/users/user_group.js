const express = require("express");
const router = express.Router();
const UserGroupController = require("../../controllers/users/user_group_controller");
// const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", async (req, res) => {
    return await UserGroupController.insertOne(req, res);
});

router.get("/all", async (req, res) => {
    return await UserGroupController.fetchAll(req, res);
});

router.get("/:id",async (req,res)=>{
    return await UserGroupController.fetchOneWithUsers(req,res);
});

router.put("/:id",async (req,res)=>{
    return await UserGroupController.updateOne(req,res);
})

router.delete("/:id",async (req,res)=>{
    return await UserGroupController.deleteOne(req,res);
})

module.exports = router;

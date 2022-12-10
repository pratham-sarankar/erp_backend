const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/class_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");

router.get("/",async (req,res)=>{
    return await ClassController.fetchAll(req,res);
});

router.post("/add",TokenMiddleware.verifyToken, async (req, res) => {
    return await ClassController.insertOne(req, res);
});

module.exports = router;

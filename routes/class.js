const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/classes/class_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");

router.get("/all",async (req,res)=>{
    return await ClassController.fetchAll(req,res);
});

router.post("/", async (req, res) => {
    return await ClassController.insertOne(req, res);
});

router.patch("/:id/tag",async function (req,res){
    return await ClassController.addTag(req,res);
})

module.exports = router;

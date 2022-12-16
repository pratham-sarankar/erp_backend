const express = require("express");
const router = express.Router();
const TagController = require("../controllers/classes/tag_controller");

router.get("/all", async (req,res)=>{
    return await TagController.fetchAll(req,res);
});

router.get("/:id",async function(req,res){
    return await TagController.fetchOne(req,res);
})

router.post("/", async (req, res) => {
    return await TagController.insertOne(req, res);
});

module.exports = router;

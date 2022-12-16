const express = require("express");
const router = express.Router();
const DesignationController = require("../controllers/employees/designation_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", async (req, res) => {
    return await DesignationController.insertOne(req, res);
});

router.get("/all", async (req, res) => {
    return await DesignationController.fetchAll(req, res);
});

router.get("/:id",async (req,res)=>{
    return await DesignationController.fetchOneWithEmployees(req,res);
});

router.put("/:id",async (req,res)=>{
    return await DesignationController.updateOne(req,res);
})

router.delete("/:id",async (req,res)=>{
    return await DesignationController.deleteOne(req,res);
})

module.exports = router;

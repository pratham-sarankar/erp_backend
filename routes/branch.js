const express = require("express");
const router = express.Router();
const BranchController = require("../controllers/branch_controller");
// const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", async (req, res) => {
    return await BranchController.insertOne(req, res);
});

router.get("/all", async (req, res) => {
    return await BranchController.fetchAll(req, res);
});

router.get("/:id",async (req,res)=>{
    return await BranchController.fetchOne(req,res);
});

router.put("/:id",async (req,res)=>{
    return await BranchController.updateOne(req,res);
});

router.delete("/:id",async (req,res)=>{
    return await BranchController.deleteOne(req,res);
});

module.exports = router;

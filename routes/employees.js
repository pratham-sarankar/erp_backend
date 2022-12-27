const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employees/employee_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");
const MulterMiddleware = require("../middlewares/multer_middleware");
const S3Middleware = require("../middlewares/aws_s3_middleware");

router.post("/", async (req, res) => {
    return await EmployeeController.insertOne(req, res);
});

router.get("/all",async function (req,res) {
    return await EmployeeController.fetchAll(req,res);
});

router.get("/search",async function(req,res){
    return await EmployeeController.search(req,res);
});

router.get("/:id",async function(req,res){
    return await EmployeeController.fetchOne(req,res);
});

router.put("/:id", async function (req,res) {
    return await EmployeeController.updateOne(req,res);
})

router.delete("/",async function (req,res){
    return await EmployeeController.deleteMany(req,res);
});

router.delete("/:id",async function(req,res){
    return await EmployeeController.deleteOne(req,res);
});

module.exports = router;

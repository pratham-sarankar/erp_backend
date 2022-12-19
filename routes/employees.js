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

router.put("/:id", async function (req,res) {
    return await EmployeeController.updateOne(req,res);
})

router.patch("/:id/designation",async function (req,res) {
    return await EmployeeController.setDesignation(req,res);
})

router.get("/images/:key",S3Middleware.downloader,async function(req,res){
    return await EmployeeController.sendProfilePicture(req,res);
})

router.patch("/:id/photo", MulterMiddleware.uploader, S3Middleware.uploader, async function(req,res){
    return await EmployeeController.uploadProfilePicture(req,res);
});

router.delete("/",async function (req,res){
    return await EmployeeController.deleteEmployees(req,res);
});

router.delete("/:id",async function(req,res){
    return await EmployeeController.deleteEmployee(req,res);
});


module.exports = router;

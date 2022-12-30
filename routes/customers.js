const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customers/customer_controller");
const TokenMiddleware = require("../middlewares/token_middlewares")
const S3Middleware = require("../middlewares/aws_s3_middleware");
const EmployeeController = require("../controllers/employees/employee_controller");

//Resource Routes
router.get("/all",async function (req,res) {
  return await CustomerController.fetchAll(req,res);
})

router.get("/:id", async (req, res) => {
  return await CustomerController.fetchOne(req,res);
});

router.put("/:id",async function (req,res){
  return await CustomerController.updateOne(req,res);
});

router.delete("/",async function (req,res){
  return await CustomerController.deleteMany(req,res);
});

router.delete("/:id",async function(req,res){
  return await CustomerController.deleteOne(req,res);
});


//Customer Routes
router.post("/login", async (req, res) => {
  return await CustomerController.login(req,res);
});

router.post("/register", async (req, res) => {
  return await CustomerController.register(req, res);
});
router.put("/",async function (req,res) {
  return await CustomerController.updateDetails(req,res);
});

router.patch('/password',async function (req,res) {
  return await CustomerController.updatePassword(req,res);
});
router.get("/images/:key",S3Middleware.downloader,async (req,res)=>{
  return req.stream.pipe(res);
});

module.exports = router;

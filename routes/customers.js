const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customers/customer_controller");
const TokenMiddleware = require("../middlewares/token_middlewares")
const S3Middleware = require("../middlewares/aws_s3_middleware");

router.get("/:id", async (req, res) => {
  return await CustomerController.fetchOne(req,res);
});

router.get("/all",async function (req,res) {
  return await CustomerController.fetchAll(req,res);
})

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

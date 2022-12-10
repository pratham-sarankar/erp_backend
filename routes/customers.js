const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer_controller"); 
const TokenMiddleware = require("../middlewares/token_middlewares")

router.get("/",TokenMiddleware.verifyToken, async (req, res) => {
  return await CustomerController.fetchOne(req,res);
});

router.post("/login", async (req, res) => {
  return await CustomerController.login(req,res);
});

router.post("/register", async (req, res) => {
  return await CustomerController.register(req, res);
});

router.post("/updateDetails",TokenMiddleware.verifyToken,async function (req,res) {
  return await CustomerController.updateDetails(req,res);
});

router.post('/updatePassword',TokenMiddleware.verifyToken,async function (req,res) {
  return await CustomerController.updatePassword(req,res);
} )

module.exports = router;

const express = require("express");
const router = express.Router();
const Controller = require("../controllers/order_controller");

router.post("/create", Controller.create);

module.exports = router;

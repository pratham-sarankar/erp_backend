const express = require("express");
const router = express.Router();
const Controller = require("../controllers/order_controller");

router.post("/", Controller.create);

module.exports = router;

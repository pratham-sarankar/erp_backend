const express = require("express");
const router = express.Router();
const Controller = require("../controllers/order_controller");

router.post("/create", Controller.create);
router.get("/:id", Controller.fetchOne);

module.exports = router;

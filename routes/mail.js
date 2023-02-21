const express = require("express");
const router = express.Router();
const Controller = require("../controllers/mail_controller");

router.post("/", Controller.sendMail);


module.exports = router;

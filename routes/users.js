const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");


router.get("/",TokenMiddleware.verifyToken, async (req, res) => {
    return await UserController.fetchOne(req,res);
});

router.get("/all",TokenMiddleware.verifyToken,async function (req,res) {
    return await UserController.fetchAll(req,res);
});

router.post("/register", async (req, res) => {
    return await UserController.register(req, res);
});

router.post("/login", async (req, res) => {
    return await UserController.login(req, res);
});



module.exports = router;

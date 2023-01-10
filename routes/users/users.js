const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/users/user_controller");
const Controller = require("../../controllers/users/user_controller");
const TokenMiddleware = require("../../middlewares/token_middlewares");


router.post("/login",UserController.login);
router.put("/password",TokenMiddleware.verifyToken, UserController.updatePassword);

router.post("/", Controller.insert);
router.get("/:id", Controller.fetchOne);
router.get("/", Controller.fetch);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/",Controller.destroyMany);





module.exports = router;
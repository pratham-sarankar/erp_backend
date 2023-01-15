const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/users/permission_controller");
// const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", Controller.insert);
router.get("/:groupId/:moduleId", Controller.fetchOne);
router.get("/", Controller.fetch);
router.put("/:groupId/:moduleId", Controller.update);
router.delete("/:groupId/:moduleId", Controller.destroy);
router.delete("/",Controller.destroyMany);

module.exports = router;

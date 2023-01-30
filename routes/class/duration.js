const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/classes/duration_controller");

router.post("/", Controller.insert);
router.get("/:id", Controller.fetchOne);
router.get("/", Controller.fetch);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/", Controller.destroyMany);

module.exports = router;

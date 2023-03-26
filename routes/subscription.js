const express = require("express");
const router = express.Router();
const Controller = require("../controllers/subscription_controller");
const OrderMiddleware = require("../middlewares/order_middleware");
const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", OrderMiddleware.verifyOrder, Controller.insert);
router.get("/", Controller.fetch);
router.get("/count", Controller.fetchWithCount);
router.get("/:id", Controller.fetchOne);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/", Controller.destroyMany);

module.exports = router;

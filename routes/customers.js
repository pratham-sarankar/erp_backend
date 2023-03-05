const express = require("express");
const router = express.Router();
const S3Middleware = require("../middlewares/aws_s3_middleware");
const Controller = require("../controllers/customers/customer_controller");
const TokenMiddleware = require("../middlewares/token_middlewares");

router.post("/", Controller.insert);
router.get("/me", TokenMiddleware.verifyToken, Controller.fetchMe);
router.get("/me/subscriptions",TokenMiddleware.verifyToken,Controller.fetchMySubscription);
router.get("/me/payments",TokenMiddleware.verifyToken,Controller.fetchMyPayments);
router.get("/:id", Controller.fetchOne);
router.get("/", Controller.fetch);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/", Controller.destroyMany);

//Customer Routes
router.post("/login/email", Controller.loginWithEmailAndPassword);
router.post("/login/phone", Controller.loginWithPhoneNumber);
router.post("/register", Controller.register);
router.get("images/:key", S3Middleware.downloader, (req, res) => {
    return req.stream.pipe(res);
});

module.exports = router;

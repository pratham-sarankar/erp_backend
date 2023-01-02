const express = require("express");
const router = express.Router();
const S3Middleware = require("../middlewares/aws_s3_middleware");
const Controller = require("../controllers/customers/customer_controller");

router.post("/", Controller.insert);
router.get("/:id", Controller.fetchOne);
router.get("/", Controller.fetchAll);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/", Controller.destroyMany);

//Customer Routes
router.post("/login", Controller.login);
router.post("/register",Controller.insert);
router.put("/",Controller.updateDetails);
router.patch("/password",Controller.updatePassword);
router.get("images/:key",S3Middleware.downloader,(req, res) => {
    return req.stream.pipe(res);
});

module.exports = router;

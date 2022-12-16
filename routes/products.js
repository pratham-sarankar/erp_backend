const express = require("express");
const router = express.Router();
const TokenMiddleware = require("../middlewares/token_middlewares");
const ProductController = require("../controllers/shop/product_controller");


router.get("/",TokenMiddleware.verifyToken, async (req,res)=>{
    return await ProductController.fetchAll(req,res);
});

router.post("/add",TokenMiddleware.verifyToken, async (req, res) => {
    return await ProductController.insertOne(req, res);
});

module.exports = router;

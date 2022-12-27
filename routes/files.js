const express = require("express");
const router = express.Router();
const MulterMiddleware = require("../middlewares/multer_middleware");
const S3Middleware = require("../middlewares/aws_s3_middleware");

router.get("/:key",S3Middleware.downloader,async (req,res)=>{
    return req.stream.pipe(res);
});

router.post("/", MulterMiddleware.uploader,S3Middleware.uploader,  async (req,res)=>{
    return res.status(200).json({status:"success",data:req.key,message:"Image uploaded successfully."})
});

module.exports = router;

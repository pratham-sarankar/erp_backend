const fs = require('fs');
const s3 = require("../config/aws_s3");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

async function uploader(req,res,next){
    try{
        const fileStream = fs.createReadStream(req.file.path);

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: fileStream,
            Key: req.file.filename
        }

        const result = await s3.upload(uploadParams).promise();
        await unlinkFile(req.file.path);

        req.key = result.Key;
        next();
    }catch (e) {
        res.status(500).json({status:"error",data:e,message:"An error occurred in s3 middleware."});
    }
}

async function downloader(req,res,next){
    try{
        const key = req.params.key;
        const downloadParams = {
            Key: key,
            Bucket: process.env.AWS_BUCKET_NAME,
        }
        req.stream = await s3.getObject(downloadParams).createReadStream();
        next();
    }catch (e) {
        res.status(500).json({status:"error",data:e,message:"An error occurred in s3 middleware."});
    }

}

module.exports = {uploader,downloader};
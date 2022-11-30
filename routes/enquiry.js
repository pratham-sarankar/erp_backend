const express = require("express");
const EnquiryController = require('../controllers/enquiry_controller')
const router = express.Router();


router.post('/',async function (req,res) {
    return await EnquiryController.insertOne(req,res);
})

module.exports = router;
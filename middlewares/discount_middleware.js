const Package = require("../models/package");
const Course = require("../models/course");

async function evaluateDiscountForClass(req,res,next){
    const foundPackage = await Package.findByPk(req.body.package_id);
    if(req.body.discount_value){
        const discountType = req.body.discount_type;
        if(!discountType){
            //If discount value is not null but the discount type is null, then set the discount value to 0
            req.body.discount_value = 0;
        }
        if(discountType=="percentage"){
            req.body.amount = foundPackage.price - (foundPackage.price * (req.body.discount_value/100));
        }else if(discountType=="price"){
            if (req.body.discount_value > foundPackage.price){
                req.body.discount_value = foundPackage.price;
            }
            req.body.amount = foundPackage.price - req.body.discount_value;
        }else{
            req.body.amount = foundPackage.price;
        }
    }else{
        req.body.amount = foundPackage.price;
    }
    next();
}

async function evaluateDiscountForCourse(req,res,next){
    const foundCourse = await Course.findByPk(req.body.course_id);
    if(req.body.discount_value){
        const discountType = req.body.discount_type;
        if(!discountType){
            //If discount value is not null but the discount type is null, then set the discount value to 0
            req.body.discount_value = 0;
        }
        if(discountType=="percentage"){
            req.body.amount = foundCourse.price - (foundCourse.price * (req.body.discount_value/100));
        }else if(discountType=="price"){
            if(req.body.discount_value > foundCourse.price){
                req.body.discount_value = foundCourse.price;
            }
            req.body.amount = foundCourse.price - req.body.discount_value;
        }else{
            req.body.amount = foundCourse.price;
        }
    }else{
        req.body.amount = foundCourse.price;
    }
    next();
}

module.exports = {evaluateDiscountForClass,evaluateDiscountForCourse};
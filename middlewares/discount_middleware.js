const Package = require("../models/package");

async function evaluateDiscount(req,res,next){
    console.log(req.body);
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
            req.body.amount = foundPackage.price - req.body.discount_value;
        }else{
            req.body.amount = foundPackage.price;
        }
    }else{
        req.body.amount = foundPackage.price;
    }
    next();
}

module.exports = {evaluateDiscount};
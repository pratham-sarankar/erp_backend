const OrderController = require("../controllers/order_controller");
const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const PaymentMode = require("../models/payment_mode");

async function verifyOrder(req,res,next){
    const instance = new Razorpay({key_id: process.env.RZR_KEY_ID, key_secret: process.env.RZR_KEY_SECRET});

    try{
        //Step 1 : If order id doesn't exist, abort with a message.
        if(!req.body.order_id){
            return res.status(401).json({
                status:"error",
                data:null,
                message:"Invalid or no order id provided.",
            });
        }

        //Step 2 : Else, fetch the order with the given id.
        const order = await instance.orders.fetch(req.body.order_id);

        //Step 3 : Verify the given order id.
        if(order.amount_due==0){
            return res.status(401).json({
                status:"error",
                data:null,
                message:"Please check out the order and try again.",
            });
        }

        //Step 4 : In order to create a payment, find the payment mode with the key == "razorpay"
        const mode = await PaymentMode.findOne({where:{key:"razorpay"}});
        req.body.mode_id = mode.id;

        //Step 5 : Create a new payment and attach the id with the body
        const payment = await Payment.create(req.body);
        req.body.payment_id = payment.id;

        //Step 6 : Call the next function.
        next();
    }catch (e) {
        next(e);
    }
}


module.exports = {verifyOrder};
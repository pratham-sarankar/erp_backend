const Razorpay = require('razorpay');

async function create(req, res, next) {
    try {
        const amount = parseFloat(req.body.amount);
        const options = {
            amount: amount * 100,
            currency: "INR",
        };
        const instance = new Razorpay({key_id: process.env.RZR_KEY_ID, key_secret: process.env.RZR_KEY_SECRET});
        const order = await instance.orders.create(options);
        if (order == null) return res.status(500).json({status: "error", message: "An error occurred", data: null});
        return res.status(200).json({status: "success", data: order, message: "Order created successfully"});
    } catch (err) {
        next(err);
    }
}

module.exports = {create};
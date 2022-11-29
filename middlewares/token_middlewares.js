const TokenController = require('../controllers/token_controller')

function verifyToken(req,res,next){
    const bearerHeader= req.headers['authorization'];
    console.log(req.headers);
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        try{
            TokenController.verifyToken(token);
            req.token = token;
            next();
        }catch (err){
            return res.status(401).json({
                status:"error",
                data:null,
                message:"Invalid or expired token.",
            });
        }
    }else{
        return res.status(401).json({
            status:"error",
            data:null,
            message:"No token provided.",
        });
    }
}

module.exports = {verifyToken};
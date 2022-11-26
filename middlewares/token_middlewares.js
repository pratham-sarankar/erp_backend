function verifyToken(req,res,next){
    console.log("Called");
    const bearerHeader= req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        next();
    }else{
        return res.status(401).json({
            status:"error",
            data:null,
            message:"Either the token is absent or is invalid. Please verify the token.",
        });
    }
    return res.status(401).json({
        status:"error",
        data:null,
        message:bearerHeader,
    });
}

module.exports = {verifyToken};
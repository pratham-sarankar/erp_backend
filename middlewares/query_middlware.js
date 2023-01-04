function queryParser(req,res,next){
    if(req.query.limit){
        req.query.limit = parseInt(req.query.limit.toString());
    }
    if(req.query.offset){
        req.query.offset = parseInt(req.query.offset.toString());
    }
    next();
}

module.exports = queryParser;
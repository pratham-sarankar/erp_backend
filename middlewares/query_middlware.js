function queryParser(req, res, next) {
    req.query.limit = parseInt(req.query.limit ? req.query.limit : "100");
    req.query.offset = parseInt(req.query.offset ? req.query.offset : "0");
    next();
}

module.exports = queryParser;
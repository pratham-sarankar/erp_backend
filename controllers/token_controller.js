const jwt = require('jsonwebtoken')

function generateNewToken(user) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const data = {uid: user.id};
    return jwt.sign(data, jwtSecretKey,{expiresIn: '7d'});
}

function verifyToken(token){
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.verify(token, jwtSecretKey);
}

function decodeToken(token){
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.decode(token,jwtSecretKey);
}

module.exports = {generateNewToken,verifyToken,decodeToken};
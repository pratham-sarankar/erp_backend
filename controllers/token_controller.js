const jwt = require('jsonwebtoken')

function generateNewToken(user) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: user.id,
    }
    return jwt.sign(data, jwtSecretKey);
}

function validateToken(token){
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.verify(token,
        jwtSecretKey,
        {algorithm: 'RS256'},
        function (err, token) {
            if (err) {
                console.log("Error generating new token.")
            } else {
                console.log(`New token generated successfully : ${token}`);
            }
        },
    );
}

module.exports = {generateNewToken,validateToken}
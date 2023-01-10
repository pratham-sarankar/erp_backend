const bcrypt = require('bcrypt');

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hashword) {
    return bcrypt.compareSync(password, hashword); // true
}


module.exports = {encryptPassword,comparePassword}
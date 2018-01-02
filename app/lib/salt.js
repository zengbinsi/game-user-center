const crypto = require('crypto');
const md5 = crypto.createHash('md5');


function salt(text, cb) {
    crypto.randomBytes(32, function (err, salt) {
        if (err) {
            throw err;
            cb(err);
        }
        salt = salt.toString('hex');

        crypto.pbkdf2(text, salt, 4096, 32, 'md5', function (err, hash) {
            if (err) {
                throw err;
            }
            hash = hash.toString('hex');
            cb(null, hash);
        });
    });
}

module.exports = salt;
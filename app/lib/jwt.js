const bluebird = require('bluebird');

const jwt = bluebird.promisifyAll(require('jsonwebtoken'));

const tokenSecret = require('../../config/config').tokenSecret;

/**
 * 生成token
 *
 */
module.exports.sign = async function (payload) {
    return await jwt.signAsync(payload, tokenSecret);
};

/**
 * 校验token
 *
 */
module.exports.verify = async function (token) {
    return await jwt.verifyAsync(token, tokenSecret);
};


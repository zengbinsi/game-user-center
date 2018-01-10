/**
 * 工具
 *
 * */

const crypto = require('crypto');

/**
 * md5 哈希
 *
 * @param {String} value
 * @return {String} hash后的值
 * */
function md5Hash(value) {
    console.log('vale ', value);
    let md5 = crypto.createHash('md5');
    md5.update(value);
    let result = md5.digest('hex').toUpperCase();
    return result;
}

let util = {
    md5Hash: md5Hash,
};

module.exports = util;
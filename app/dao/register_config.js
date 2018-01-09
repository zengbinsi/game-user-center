/**
 * 注册配置 DAO
 * */

const registerConfigModel = require('../models').registerConfig;


/**
 * 获取注册配置
 * */
async function get(key) {
    let config = await registerConfigModel.findOne({
        where: {
            key: key
        }
    });
    return config;
}

module.exports = {
    get: get
};



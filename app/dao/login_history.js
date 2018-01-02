/**
 * 登录记录
 *
 */
const loginHistory = require('../models').loginHistory;

/**
 * 保存登录记录
 */
async function create(loginData) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);
    loginData.login_time = nowTimeStamp;
    loginData.created_at = nowTimeStamp;
    loginData.updated_at = nowTimeStamp;

    return await loginHistory.create(loginData);
}

let logHistoryDao = {
    create: create
};

module.exports = logHistoryDao;
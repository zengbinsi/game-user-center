/**
 * 钱包记录
 * */

let walletLogModel = require('../models').walletLog;


/**
 * 新增钱包记录
 * */
async function insert(walletLog) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);
    walletLog.created_at = nowTimeStamp;
    walletLog.updated_at = nowTimeStamp;
    return await walletLogModel.create(walletLog);
}

let walletLogDao = {
    insert: insert
};
module.exports = walletLogDao;

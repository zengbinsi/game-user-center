/**
 * purchaseHistoryDao
 *
 */

let purchaseHistoryModel = require('../models').purchaseHistory;

/**
 * 保存消费记录
 * */
async function insert(purchaseHistory) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);
    purchaseHistory.created_at = nowTimeStamp;
    purchaseHistory.updated_at = nowTimeStamp;
    return await purchaseHistoryModel.create(purchaseHistory);
}

let purchaseHistoryDao = {
    insert: insert
};
module.exports = purchaseHistoryDao;

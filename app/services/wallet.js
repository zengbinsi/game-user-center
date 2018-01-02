/**
 * 钱包 service
 */

const walletDao = require('../dao/wallet');
const walletLogDao = require('../dao/wallet_log');
const purchaseHistoryDao = require('../dao/purchase_history');

const walletLogModel = require('../models/').walletLog;
const logger = require('../lib/logger');


/**
 * 获取用户钱包
 * */
async function getWallet(uid) {
    try {
        return await walletDao.findByUId(uid);
    } catch (err) {
        logger.error(err);
    }
}

let walletService = {
    getWallet: getWallet
};

module.exports = walletService;




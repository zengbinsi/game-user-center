/**
 * 钱包 service
 */

const registerConfigDao = require('../dao/register_config');
const userConstant = require('../constants/user');
const walletDao = require('../dao/wallet');
const walletLogDao = require('../dao/wallet_log');

const logger = require('../lib/logger');

const walletLogReason = require('../constants/wallet_log_type');

const PLATFORM = 0;

/**
 * 初始化钱包
 * */
async function initWallet(uid) {
    // 注册配置信息：注册送多少金币
    let registerConfig = await registerConfigDao.get(userConstant.REGISTER_GOLD_KEY);
    let gold = parseInt(registerConfig.value) || 0;
    let walletLog = {
        uid: uid,
        gold: gold,
        type: walletLogReason.REGISTER,
    };
    let wallet = {
        uid: uid,
        gold: gold
    };
    await walletLogDao.insert(walletLog);
    await walletDao.create(wallet);
}

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

/**
 * 转账
 *
 * */
async function transfer(transformList) {
    if (!(transformList instanceof Array)) {
        let temp = transformList;
        transformList = [];
        transformList[0] = temp;
    }
    for (let i = 0; i < transformList.length; i++) {
        let transfer = transformList[i];
        if (transfer.to !== PLATFORM) {
            let fromUid = transfer.from;
            let toUid = transfer.to;

            let fromUserWallet = await walletDao.findByUId(fromUid);
            let toUserWallet = await walletDao.findByUId(toUid);

            // 修改用户金币
            await walletDao.update(fromUid, {
                gold: fromUserWallet.gold - transfer.gold
            });
            await walletDao.update(toUid, {
                gold: toUserWallet.gold + transfer.gold
            });
            let fromWalletLog = {
                uid: fromUid,
                from: fromUid,
                to: toUid,
                gold: transfer.gold,
                type: transfer.type,
                extra: transfer.extra || '',
            };
            let toWalletLog = {
                uid: toUid,
                from: fromUid,
                to: toUid,
                gold: transfer.gold,
                type: transfer.type,
                extra: transfer.extra || '',
            };
            // 保存记录
            await walletLogDao.insert(fromWalletLog);
            await walletLogDao.insert(toWalletLog);
            // 转账给平台：牛牛扣除房间佣金等
        } else if (transfer.to === PLATFORM) {
            let uid = transfer.from;
            // 修改用户金币
            let wallet = await walletDao.findByUId(uid);
            await walletDao.update(uid, {
                gold: wallet.gold - transfer.gold
            });
            let walletLog = {
                uid: uid,
                from: transfer.from,
                to: transfer.to,
                gold: transfer.gold,
                type: transfer.type,
                extra: transfer.extra || '',
            };
            // 保存记录
            await walletLogDao.insert(walletLog);
        }
    }
}

let walletService = {
    getWallet: getWallet,
    transfer: transfer,
    initWallet: initWallet
};

module.exports = walletService;




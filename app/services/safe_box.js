/**
 * 保险箱
 * */

const safeBoxDao = require('../dao/safe_box');
const safeBoxLogDao = require('../dao/safe_box_log');
const walletDao = require('../dao/wallet');
const walletLogDao = require('../dao/wallet_log');

const userDao = require('../dao/user');

const safeBoxConstant = require('../constants/safebox');
const walletLogType = require('../constants/wallet_log_type');
const responseCode = require('../constants/response_code');
const userConstant = require('../constants/user');

/**
 * 创建保险箱
 * */
async function initSafeBox(uid) {
    let safeBox = {
        uid: uid,
        gold: 0,
        password: '',
        status: safeBoxConstant.STATUS_ENABLE
    };
    return await safeBoxDao.create(safeBox);
}

/**
 * 查询保险柜
 * */
async function getSafeBox(uid) {
    let safeBox = await safeBoxDao.findById(uid);
    // 保险柜被禁用
    if (safeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    return safeBox;
}

/**
 * 设置密码
 * */
async function setPassWord(uid, password) {
    let safeBox = await getSafeBox(uid);
    // 保险柜被禁用
    if (safeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    let updateResult = await safeBoxDao.update(uid, {
        password: password
    });
    if (!updateResult) {
        return null;
    }

    let wallet = await walletDao.findByUId(uid);
    let newSafeBox = await getSafeBox(uid);

    return {
        safebox_gold: newSafeBox.gold,
        wallet_gold: wallet.gold,
    };
}

/**
 * 修改密码
 *
 * @param {Number} uid 用户id
 * @param {Number} oldPassWord 旧密码
 * @param {Number} newPassword 新密码
 * */
async function updatePassWord(uid, oldPassWord, newPassword) {
    let safeBox = await safeBoxDao.findById(uid);
    if (!safeBox) {
        return null;
    }
    // 保险柜被禁用
    if (safeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    // 判断旧密码是否正确
    if (oldPassWord !== safeBox.password) {
        let error = new Error('保险柜旧密码不正确！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    let updateResult = await safeBoxDao.update(uid, {
        password: newPassword
    });
    if (!updateResult) {
        return null;
    }
    let wallet = await walletDao.findByUId(uid);
    return {
        safebox_gold: safeBox.gold,
        wallet_gold: wallet.gold,
    };
}

/**
 * 转账
 *
 * @param {Number} fromUserId 转出方用户id
 * @param {Number} toUserId 转入方用户id
 * @param {Number} gold 金币
 * @param {Number} password 密码
 */
async function transfer(fromUserId, toUserId, gold, password) {
    let fromSafeBox = await safeBoxDao.findById(fromUserId);
    // 保险柜被禁用
    if (fromSafeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    if (fromSafeBox.password !== password) {
        let err = new Error('保险柜密码不正确！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    let toUserInfo = await userDao.findByUId(toUserId);
    // 接收方id是否正确
    if (!toUserInfo) {
        let err = new Error('接收方用户不存在，请确认接收方用户id是否正确！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 转账金额是否足够
    if (fromSafeBox.gold < gold) {
        let err = new Error('转账金额不足！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 判断转入方是否有权限接收
    if (toUserInfo.type !== userConstant.USER_TYPE_AGENT && toUserInfo.type !== userConstant.USER_TYPE_GM) {
        let err = new Error('接收方用户没有权限接收转账！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }

    let toUserSafeBox = await safeBoxDao.findById(toUserId);
    if (toUserSafeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('对方保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    // 扣除转出方金币
    await safeBoxDao.update(fromUserId, {
        gold: parseInt(fromSafeBox.gold) - gold
    });
    // 添加转入方金币
    await safeBoxDao.update(toUserId, {
        gold: parseInt(toUserSafeBox.gold) + gold
    });
    // 转出记录
    let transferOutSafeBoxLog = {
        uid: fromUserId,
        from: fromUserId,
        to: toUserId,
        gold: gold,
        type: safeBoxConstant.TYPE_TRANSFER_OUT,
    };
    // 转入记录
    let transferInSafeBoxLog = {
        uid: toUserId,
        from: fromUserId,
        to: toUserId,
        gold: gold,
        type: safeBoxConstant.TYPE_TRANSFER_IN,
    };
    await safeBoxLogDao.insert(transferOutSafeBoxLog);
    await safeBoxLogDao.insert(transferInSafeBoxLog);

    let newSafeBoxData = await safeBoxDao.findById(fromUserId);
    return {
        safebox_gold: newSafeBoxData.gold,
    };
}

/**
 * 从钱包转入到保险箱
 *
 * @param {Number} uid 用户id
 * @param {Number} gold 金币
 * @param {String} password 密码
 * */
async function into(uid, gold, password) {
    let safeBox = await safeBoxDao.findById(uid);
    if (safeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    if (safeBox.password !== password) {
        let err = new Error('保险柜密码不正确！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 判断钱包金额是否足够转入
    let wallet = await walletDao.findByUId(uid);
    if (wallet.gold < gold) {
        let err = new Error('钱包金额不足转入！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 更新保险柜金额
    await safeBoxDao.update(uid, {
        gold: safeBox.gold + gold,
    });
    // 更新钱包金额
    await walletDao.update(uid, {
        gold: wallet.gold - gold,
    });

    let safeBoxLog = {
        uid: uid,
        from: uid,
        to: uid,
        gold: gold,
        type: safeBoxConstant.TYPE_INTO,
    };
    await safeBoxLogDao.insert(safeBoxLog);

    let walletLog = {
        uid: uid,
        from: uid,
        to: uid,
        gold: gold,
        type: walletLogType.ROLL_OUT_SAFEBOX
    };
    await walletLogDao.insert(walletLog);
    // 查询新的保险柜金额和钱包金额
    let newWalletData = await walletDao.findByUId(uid);
    let newSafeBoxData = await safeBoxDao.findById(uid);

    return {
        safebox_gold: newSafeBoxData.gold,
        wallet_gold: newWalletData.gold,
    };
}

/**
 * 从保险箱转出到钱包
 *
 * @param {Number} uid 用户id
 * @param {Number} gold 金币
 * @param {String} password 密码
 * */
async function rollOut(uid, gold, password) {
    let safeBox = await safeBoxDao.findById(uid);
    if (safeBox.status !== safeBoxConstant.STATUS_ENABLE) {
        let error = new Error('您的保险柜被封禁！');
        error.code = responseCode.ERROR;
        error.status = 200;
        throw error;
    }
    if (safeBox.password !== password) {
        let err = new Error('保险柜密码不正确！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 判断钱包金额是否足够转入
    let wallet = await walletDao.findByUId(uid);
    if (safeBox.gold < gold) {
        let err = new Error('保险柜金额不足转出！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }

    // 更新保险柜金额
    await safeBoxDao.update(uid, {
        gold: safeBox.gold - gold,
    });
    // 更新钱包金额
    await walletDao.update(uid, {
        gold: wallet.gold + gold,
    });

    let safeBoxLog = {
        uid: uid,
        from: uid,
        to: uid,
        gold: gold,
        type: safeBoxConstant.TYPE_ROLL_OUT,
    };
    await safeBoxLogDao.insert(safeBoxLog);

    let walletLog = {
        uid: uid,
        from: uid,
        to: uid,
        gold: gold,
        type: walletLogType.INTO_FROM_SAFEBOX
    };
    await walletLogDao.insert(walletLog);
    // 查询新的保险柜金额和钱包金额
    let newWalletData = await walletDao.findByUId(uid);
    let newSafeBoxData = await safeBoxDao.findById(uid);

    return {
        safebox_gold: newSafeBoxData.gold,
        wallet_gold: newWalletData.gold,
    };
}

let safeBoxService = {
    initSafeBox: initSafeBox,
    setPassWord: setPassWord,
    updatePassWord: updatePassWord,
    transfer: transfer,
    into: into,
    rollOut: rollOut,
    getSafeBox: getSafeBox
};

module.exports = safeBoxService;
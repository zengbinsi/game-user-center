/**
 * 保险箱
 * */

const express = require('express');
const router = express.Router();

const responseCodeConstant = require('../constants/response_code');

const safeBoxService = require('../services/safe_box');
const walletService = require('../services/wallet');

const logger = require('../lib/logger');

const checkLogin = require('../middleware/check_login');

module.exports = function (app) {
    app.use('/account/safe_box', router);
    router.get('/', checkLogin, getSafeBox);
    router.post('/set_psw', checkLogin, setPassWord);
    router.post('/update_psw', checkLogin, updatePassWord);
    router.post('/transfer', checkLogin, transfer);
    router.post('/into', checkLogin, into);
    router.post('/roll_out', checkLogin, rollOut);
    router.get('/transfer_out_detail', checkLogin, transferOutDetail);
    router.get('/transfer_in_detail', checkLogin, transferOutDetail);
};

const UN_SET_SAFE_BOX_PASSWORD = 0;     // 未设置保险柜密码
const SETED_SAFE_BOX_PASSWORD = 1;     // 已设置保险柜密码

/**
 * 获取保险箱
 * */
async function getSafeBox(req, res, next) {
    let uid = req.user.uid;
    try {
        let safeBox = await safeBoxService.getSafeBox(uid);
        let wallet = await walletService.getWallet(uid);
        // 未设置密码
        if (!safeBox.password) {
            res.success({
                password_state: UN_SET_SAFE_BOX_PASSWORD
            });
        } else {
            res.success({
                wallet_gold: wallet.gold,
                safebox_gold: safeBox.gold,
                password_state: SETED_SAFE_BOX_PASSWORD,
            })
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 设置保险箱密码
 * */
async function setPassWord(req, res, next) {
    let password = req.body.password;

    if (!password) {
        let error = new Error('请输入保险柜密码！');
        error.code = responseCodeConstant.PARAMS_ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (password.length < 6 || password.length > 16) {
        let error = new Error('保险柜密码长度不正确（6-16）！');
        error.code = responseCodeConstant.PARAMS_ERROR;
        error.status = 200;
        next(error);
        return;
    }
    try {
        let result = await safeBoxService.setPassWord(req.user.uid, password);
        if (result) {
            res.success(result);
        } else {
            let error = new Error('设置保险柜密码失败！');
            error.code = responseCodeConstant.ERROR;
            error.status = 200;
            next(error);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 修改保险箱密码
 *
 * 参数 旧密码 新密码
 * */
async function updatePassWord(req, res, next) {
    let oldPassword = req.body.old_password;
    let newPassword = req.body.new_password;

    if (!oldPassword) {
        let error = new Error('请输入旧保险柜密码！');
        error.code = responseCodeConstant.PARAMS_ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (!newPassword) {
        let error = new Error('请输入新保险柜密码！');
        error.code = responseCodeConstant.PARAMS_ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (newPassword.length < 6 || newPassword.length > 16) {
        let error = new Error('新保险柜密码长度不正确！（6-16）');
        error.code = responseCodeConstant.PARAMS_ERROR;
        error.status = 200;
        next(error);
        return;
    }
    try {
        let result = await safeBoxService.updatePassWord(req.user.uid, oldPassword, newPassword);
        if (result) {
            res.success(result);
        } else {
            let error = new Error('修改保险柜密码失败！');
            error.code = responseCodeConstant.ERROR;
            error.status = 200;
            next(error);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 转账
 *
 * 参数：to 查询用户是否存在
 * 参数：gold 判断金额是否正确，10的倍数，大于0，小于或等于自身保险柜已有金额
 * */
async function transfer(req, res, next) {
    let toUserId = req.body.to;
    let gold = req.body.gold;
    let password = req.body.password;

    if (!toUserId) {
        let error = new Error('请输入对方用户id');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (!gold) {
        let error = new Error('请输入转账金额！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    gold = parseInt(gold);
    if (isNaN(gold)) {
        let error = new Error('转账进入格式不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (gold < 0) {
        let error = new Error('转账金额不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (gold % 10 !== 0) {
        let error = new Error('转账金额不正确（必须是10的倍数）！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (!password) {
        let error = new Error('请输入保险柜密码！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (req.user.id === parseInt(toUserId)) {
        let error = new Error('不能转账给自己！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    try {
        gold = parseInt(gold);
        console.log('user id', req.user.id);
        let result = await safeBoxService.transfer(req.user.uid, toUserId, gold, password);
        // 转账成功返回保险柜金额
        if (result) {
            res.success(result);
        } else {
            let error = new Error('转账失败！');
            error.code = responseCodeConstant.ERROR;
            error.status = 200;
            next(error);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 提取到钱包
 *
 * 参数：gold 判断金额是否正确，，大于0，小于或等于自身保险柜已有金额
 * */
async function rollOut(req, res, next) {
    let gold = req.body.gold;
    let password = req.body.password;

    if (!gold) {
        let error = new Error('请输入提取金额！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (gold < 0) {
        let error = new Error('提取金额不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    gold = parseInt(gold);
    if (isNaN(gold)) {
        let error = new Error('提取金额格式不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (!password) {
        let error = new Error('请输入保险柜密码！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    try {
        gold = parseInt(gold);
        let result = await safeBoxService.rollOut(req.user.uid, gold, password);
        // 转账成功返回保险柜金额，钱包金额
        if (result) {
            res.success(result);
        } else {
            let error = new Error('提取失败！');
            error.code = responseCodeConstant.ERROR;
            error.status = 200;
            next(error);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 从钱包转入
 *
 * 参数：gold 判断金额是否正确，大于0，小于或等于自身钱包已有金额
 * */
async function into(req, res, next) {
    let gold = req.body.gold;
    let password = req.body.password;

    if (!gold) {
        let error = new Error('请输入存入金额！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (gold < 0) {
        let error = new Error('存入金额不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    gold = parseInt(gold);
    if (isNaN(gold)) {
        let error = new Error('存入金额格式不正确！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    if (!password) {
        let error = new Error('请输入保险柜密码！');
        error.code = responseCodeConstant.ERROR;
        error.status = 200;
        next(error);
        return;
    }
    try {

        let result = await safeBoxService.into(req.user.uid, gold, password);
        // 转账成功返回保险柜金额，钱包金额
        if (result) {
            res.success(result);
        } else {
            let error = new Error('提取失败！');
            error.code = responseCodeConstant.ERROR;
            error.status = 200;
            next(error);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}


/**
 * 转给其它用户明细
 * */
async function transferOutDetail(req, res, next) {

}

/**
 * 其它用户转入明细
 * */
async function transferInDetail(req, res, next) {

}



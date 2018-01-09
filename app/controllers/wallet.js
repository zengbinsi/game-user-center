/**
 * 钱包
 * */
const express = require('express');
const router = express.Router();

const walletService = require('../services/wallet');
const responseCode = require('../constants/response_code');

const logger = require('../lib/logger');


module.exports = function (app) {
    app.use('/account/wallet', router);
    router.post('/balance', getBalance);
    router.post('/transfer', transfer);
};

/**
 * 获取钱包余额
 * */
async function getBalance(req, res, next) {
    let uid = req.body.uid;
    // 校验权限
    // sign
    try {
        let wallet = await walletService.getWallet(uid);
        res.success(wallet);
    } catch (err) {
        next(err);
        logger.error(err);
    }
}

/**
 * 修改用户金币
 * */
async function transfer(req, res, next) {
    let transferList = req.body.transfer;
    if (!transferList) {
        let err = new Error('参数 transfer 不正确');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        next(err);
        return;
    }
    try {
        if (typeof transferList === 'string') {
            transferList = JSON.parse(transferList);
        }
        // 先执行转账，转账后查询用户钱包
        await walletService.transfer(transferList);
        let uids = req.body.uids;
        if (uids) {
            if (typeof uids === 'string') {
                uids = JSON.parse(uids);
            }
            let wallets = [];
            // 查询
            for (let i = 0; i < uids.length; i++) {
                let uid = uids[i];
                wallets[i] = await walletService.getWallet(uid);
            }
            res.success(wallets);
        } else {
            res.success({});
        }
    } catch (err) {
        next(err);
        logger.error(err);
    }
}

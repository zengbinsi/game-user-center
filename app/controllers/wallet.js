/**
 * 钱包
 * */
const express = require('express');
const router = express.Router();

const responseCode = require('../constants/response_code');
const walletService = require('../services/wallet');

const logger = require('../lib/logger');


module.exports = function (app) {
    app.use('/account/wallet', router);
    router.post('/balance', getBalance);
};

/**
 * 获取钱包余额
 * */
async function getBalance(req, res, next) {
    // TODO 鉴权
    let appid = req.body.app_id;
    let appkey = req.body.app_key;
    let sign = req.body.sign;
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



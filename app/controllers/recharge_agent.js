/**
 * 充值代理
 * */

const express = require('express');
const router = express.Router();

const logger = require('../lib/logger');

const rechargeAgentService = require('../services/recharge_agent');

module.exports = function (app) {
    app.use('/account/recharge_list', router);

    router.get('/', getRechargeList);
};

/**
 * 获取充值列表
 * */
async function getRechargeList(req, res, next) {
    try {
        let rechargeList = await rechargeAgentService.getRechargeList() || [];
        res.success(rechargeList);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 充值代理
 * */

let rechargeAgentDao = require('../dao/recharge_agent');

/**
 * 获取充值代理列表
 * */
async function getRechargeList() {
    return await rechargeAgentDao.getRechargeList();
}

let rechargeAgentService = {
    getRechargeList: getRechargeList
};

module.exports = rechargeAgentService;
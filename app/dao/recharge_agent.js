/**
 * 充值代理
 * */

const rechargeAgentModel = require('../models').rechargeAgent;

/**
 * 获取充值代理列表
 * */
async function getRechargeList() {
    return await rechargeAgentModel.findAll({
        where: {
            status: rechargeAgentModel.ENABLE
        },
        attributes: ['chart_id', 'type', 'explain']
    });
}

let rechargeAgentDao = {
    getRechargeList: getRechargeList,
};
module.exports = rechargeAgentDao;
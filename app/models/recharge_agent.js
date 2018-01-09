/**
 *  充值代理
 * */

module.exports = function (sequelize, DataTypes) {
    let rechargeAgent = sequelize.define('rechargeAgent', {
        chart_id: DataTypes.STRING,
        admin_name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        explain: DataTypes.STRING,
        status: DataTypes.INTEGER,
    }, {
        tableName: 'recharge_agent'
    });
    rechargeAgent.ENABLE = 1;   //  可用状态
    return rechargeAgent;
};
/**
 * 钱包变更类型
 * */
let walletLogType = {
    REGISTER: 0,                // 注册赠送
    NIUNIU_COMMISSION: 5,       // 牛牛佣金
    NIUNIU_RESULT: 10,          // 牛牛结果
    INTO_FROM_SAFEBOX: 15,      // 从保险柜提取
    ROLL_OUT_SAFEBOX: 20,       // 存入保险柜
    TYPE_EXCHANGE: 25,               // 充值
};

module.exports = walletLogType;
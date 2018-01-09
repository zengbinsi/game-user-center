/**
 * 保险柜变更类型
 * */
let safeBox = {
    TYPE_EXCHANGE: 1,                // 充值
    TYPE_INTO: 5,                    // 从钱包存入
    TYPE_ROLL_OUT: 11,               // 提取到钱包
    TYPE_TRANSFER_OUT: 16,           // 转出给其它用户
    TYPE_TRANSFER_IN: 21,            // 从其它用户转入

    STATUS_ENABLE: 1,                // 保险柜状态可用
};

module.exports = safeBox;
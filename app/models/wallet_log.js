/**
 * 钱包记录
 *
 * */
module.exports = function (sequelize, DataTypes) {
    let walletLog = sequelize.define('walletLog', {
        uid: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,          // 增加 或者 减少
        reason: DataTypes.INTEGER,          // 0.注册 1.后台增加 2.充值
        master_id: DataTypes.INTEGER,       // 后台增加时，写入管理员id
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'wallet_log'
    });

    walletLog.REASON = {
        REGISTER: 0,
        ADMIN: 1,
        EXCHANGE: 2,
        CREATE_ROOM: 3,
    };
    return walletLog;
};


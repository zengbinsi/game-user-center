/**
 * 钱包记录
 *
 * */
module.exports = function (sequelize, DataTypes) {
    let walletLog = sequelize.define('walletLog', {
        uid: DataTypes.INTEGER,
        gold: DataTypes.INTEGER,          // 增加 或者 减少
        type: DataTypes.INTEGER,          // 0.注册赠送，5 牛牛房间佣金，10，牛牛玩家结果
        master_id: DataTypes.INTEGER,       // 后台增加时，写入管理员id
        from: DataTypes.INTEGER,            // 从哪个玩家
        to: DataTypes.INTEGER,              //
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


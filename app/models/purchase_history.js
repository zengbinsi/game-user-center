/**
 * 消费记录
 * */
module.exports = function (sequelize, DataTypes) {
    let purchaseHistory = sequelize.define('purchaseHistory', {
            uid: DataTypes.INTEGER,
            type: DataTypes.INTEGER,                     // 消费类型： 1.创建房间
            amount: DataTypes.INTEGER,                   // 价格
            extra: DataTypes.STRING,                     //  补充说明
            created_at: DataTypes.INTEGER,
            updated_at: DataTypes.INTEGER,
        }, {
            tableName: "purchase_history"
        }
    );

    purchaseHistory.TYPE = {
        CREATE_ROOM: 0
    };
    return purchaseHistory;
};

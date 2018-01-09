/**
 * 保险柜操作记录
 * */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('safeBoxLog', {
        uid: DataTypes.INTEGER,
        from: DataTypes.INTEGER,
        to: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        gold: DataTypes.INTEGER,
        time: DataTypes.INTEGER,
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'safe_box_log'
    })
};
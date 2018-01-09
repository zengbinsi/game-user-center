/**
 * 玩家权重
 *

 * */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('gameWeight', {
        uid: DataTypes.INTEGER,
        min_weight: DataTypes.INTEGER,
        max_weight: DataTypes.INTEGER,
        weight: DataTypes.INTEGER,
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER
    }, {
        tableName: 'game_weight',
    })
};
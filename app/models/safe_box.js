/**
 * 保险柜
 *
 * */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('safeBox', {
        uid: DataTypes.INTEGER,
        gold: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        password: DataTypes.STRING,
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'safe_box'
    });
};
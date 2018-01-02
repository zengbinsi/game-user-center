/**
 * 钱包
 * */

module.exports = function (sequelize, DataTypes) {
    let wallet = sequelize.define('wallet', {
        uid: DataTypes.INTEGER,
        gold: DataTypes.INTEGER,
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'wallet'
    });
    return wallet;
};

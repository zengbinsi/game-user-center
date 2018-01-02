/**
 * 登录记录
 *
 */

module.exports = function (sequelize, DataTypes) {
    let loginHistory = sequelize.define('loginHistory', {
        uid: DataTypes.INTEGER,

        login_ip: DataTypes.STRING(36),
        login_time: DataTypes.INTEGER,
        user_agent: DataTypes.STRING(256),

        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'login_history',
    });
    return loginHistory;
};

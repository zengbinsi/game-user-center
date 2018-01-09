/**
 * 用户 Model
 *
 * @author
 */
module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define('user', {
        username: DataTypes.STRING(36),  // 用户名
        password: DataTypes.STRING(36), // 密码
        nick: DataTypes.STRING(24),     // 昵称
        salt: DataTypes.STRING(64),      // 加盐
        avatar: DataTypes.STRING(128),  // 头像
        sex: DataTypes.INTEGER,
        type: DataTypes.INTEGER,        // 用户类型
        register_ip: DataTypes.STRING(36),  // 注册ip
        register_time: DataTypes.INTEGER,   // 注册时间
        status: DataTypes.INTEGER,          // 状态
        eid: DataTypes.STRING,              // 推广员id

        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'user',
    });

    User.ENABLE = 1;
    User.DISABLE = 0;

    return User;
};

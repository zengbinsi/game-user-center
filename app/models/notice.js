/**
 * 公告
 * */

module.exports = function (sequelize, DataTypes) {
    let notice = sequelize.define('notice', {
        content: DataTypes.TEXT,        // 内容
        title: DataTypes.STRING(30),    // 标题
        start_time: DataTypes.INTEGER,   // 开始时间
        expire_time: DataTypes.INTEGER,  // 过期时间
        gm_id: DataTypes.INTEGER,        // 编辑人id:
        status: DataTypes.INTEGER,      // 状态：0：禁用， 1.启用
        created_at: DataTypes.INTEGER,  // 数据创建时间
        updated_at: DataTypes.INTEGER,  // 数据修改时间
    }, {
        tableName: 'notice',
    });

    notice.ENABLE = 1;    // 启用公告
    notice.DISABLE = 0;   // 禁用公告

    return notice;
};




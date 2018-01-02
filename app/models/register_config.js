/**
 * 注册配置信息表
 * */

module.exports = function (sequelize, DataTypes) {
    let model = sequelize.define('registerConfig', {
        value: DataTypes.STRING,
        key: DataTypes.STRING,
        created_at: DataTypes.INTEGER,
        updated_at: DataTypes.INTEGER,
    }, {
        tableName: 'register_config'
    });
    return model;
};


/**
 * 加载所有model
 *
 */

const fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    mysqlConfig = require('../../config/mysql'),
    db = {};

let sequelize = new Sequelize(
    mysqlConfig.dbname, mysqlConfig.username, mysqlConfig.password, {
        host: mysqlConfig.host,
        dialect: 'mysql',
        logging: function (sql) {
        },
        pool: {
            max: 10,
            min: 0,
            idle: 10 * 1000
        },
        define: {
            timestamps: false // 不需要默认的createdAt和updateAt
        }
    });

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

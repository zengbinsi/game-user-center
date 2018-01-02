/**
 * mysql 配置
 * */
const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        username: "root",
        password: "root",
        dbname: "game_user_center",
        port: "3306",
        host: "127.0.0.1",
    },

    production: {
        username: "root",
        password: "As414682464.",
        dbname: "game_user_center",
        port: "3306",
        host: "rm-uf66g6481y9q6g10e.mysql.rds.aliyuncs.com",
    },
};
module.exports = config[env];


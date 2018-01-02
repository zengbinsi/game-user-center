/**
 * redis 配置信息
 * */
const env = process.env.NODE_ENV || 'development';

const config = {

    development: {
        port: "6379",
        host: "127.0.0.1",
        password: '',
    },

    production: {
        port: "6379",
        host: "127.0.0.1",
        password: '',
    },
};

module.exports = config[env];

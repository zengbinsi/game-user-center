/**
 * 日志工具类
 *
 * 生产环境输出到文件
 * 开发环境输出到控制台
 *
 * */
const path = require('path');
const fs = require('fs');

const winston = require('winston');

require('winston-daily-rotate-file');

const env = process.env.NODE_ENV || 'development';

let logRootPath = './';


let transport = new winston.transports.DailyRotateFile({
    filename: logRootPath + 'logs/log',
    name: 'log_file',
    prepend: true,
    datePattern: 'yyyy-MM-dd.',
    level: 'info'
});

let errTransport = new winston.transports.DailyRotateFile({
    filename: logRootPath + 'logs/error/log',
    name: 'error_file',
    prepend: true,
    datePattern: 'yyyy-MM-dd.',
    level: 'error'
});

let errorWinstonLogger = new winston.Logger({
    transports: [
        errTransport,
    ]
});

let winstonLogger = new winston.Logger({
    transports: [
        transport,
    ]
});

/**
 * 初始化Logger
 *
 * @param {String} rootPath 日志根目录
 * */
function init(rootPath) {
    if (rootPath) {
        logRootPath = rootPath;
    }
    // 创建日志文件夹
    fs.existsSync(logRootPath) || fs.mkdirSync(logRootPath);
    let logPath = path.join(logRootPath, 'info');
    let errorLogPath = path.join(logRootPath, 'error');
    fs.existsSync(logPath) || fs.mkdirSync(logPath);
    fs.existsSync(errorLogPath) || fs.mkdirSync(errorLogPath);
}

/**
 * 打印 info级别日志
 * */
function info() {
    let msg = '';
    for (let i = 0; i < arguments.length; i++) {
        msg += arguments[i].toString() + ' ';
    }
    if (env === 'development') {
        console.log(msg);
    } else {
        winstonLogger.info(msg);
    }
}

/**
 * 打印错误日志
 *
 * */
function error() {
    let msg = '';
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Error) {
            msg += arguments[i].stack;
        } else {
            msg += arguments[i].toString() + ' ';
        }
    }
    if (env === 'development') {
        console.error(msg);
    } else {
        errorWinstonLogger.error(msg);
    }
}

let logger = {
    init: init,
    info: info,
    error: error,
};

module.exports = logger;

/**
 * 请求日志模块
 * */
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('../../config/config');

/*
* 按照日期切割日志
* */
const FileStreamRotator = require('file-stream-rotator');

const logRootDirectory = path.join(config.root, '/logs/');

// 创建日志文件夹
fs.existsSync(logRootDirectory) || fs.mkdirSync(logRootDirectory);

let logDirectory = path.join(logRootDirectory, '/access');

// 创建日志文件夹
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// // 自定义token 请求体
// logger.token('req_body', function (req, res) {
//   return req.body.toString() || '';
// });
//
// logger.token('req_params', function (req, res) {
//   return req.params.toString() || '';
// });
//
// logger.token('res_body', function (req, res) {
//   return res.body || '';
// });

const accessLogStream = FileStreamRotator.getStream({
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

// logger.format('full', ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :req_params :req_body ' +
//   ':status ' + '+ :res_body :res[content-length] ":referrer" ":user-agent"');

module.exports = logger('combined', {
    stream: accessLogStream,
    flags: 'a'
});

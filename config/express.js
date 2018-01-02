const glob = require('glob');

const express = require('express');
const accessLogger = require('../app/lib/access_logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

const cors = require('cors');

let resposeCode = require('../app/constants/response_code');

module.exports = function (app, config) {
    let env = process.env.NODE_ENV || 'development';
    app.locals.ENV = env;
    app.locals.ENV_DEVELOPMENT = env == 'development';

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.use(cors());
    app.use(accessLogger);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(compress());
    console.log('root ', config.root);
    app.use(express.static(config.root + '/public'));
    app.use(methodOverride());

    /*
     * 挂载成功响应方法
     */
    app.use(function (req, res, next) {
        res.success = function (data) {
            let response = {
                code: resposeCode.SUCCESS,
                msg: "请求成功！",
                data: data
            };
            this.json(response);
        };
        next();
    });

    let controllers = glob.sync(config.root + '/app/controllers/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /**
     * 开发环境下处理异常处理
     * */
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            let statusCode = err.status || 500;
            let code = err.code || statusCode;
            let errMsg = err.errMsg || err.message;

            let response = {
                code: code,
                msg: errMsg,
                err_detail: err.stack
            };
            res.status(statusCode);
            res.json(response);
        });
    }

    app.use(function (err, req, res, next) {
        let statusCode = err.status || 500;
        let code = err.code || statusCode;
        let errMsg = err.errMsg || err.message;

        let response = {
            code: code,
            msg: errMsg,
        };
        res.status(statusCode);
        res.json(response);
    });

    return app;
};

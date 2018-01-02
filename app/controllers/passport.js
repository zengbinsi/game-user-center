/**
 * 账号 controller
 * */

const express = require('express');
const router = express.Router();

const responseCode = require('../constants/response_code');

const userService = require('../services/user');
const logger = require('../lib/logger');

const jwt = require('../lib/jwt');

module.exports = function (app) {
    app.use('/passport', router);

    router.post('/register', register);
    router.post('/token', loginByToken);
    router.post('/login', loginByUserName);
};

/**
 *  注册
 *
 *  用户名
 *  昵称
 *  密码
 * */
async function register(req, res, next) {
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;   // 取出客户端ip
    let ua = req.get('User-Agent') || '';

    let eid = '';

    if (req.query.eid) {
        eid = req.query.eid;
    }
    // 获取用户名，密码，昵称
    let nick = req.body.nick;
    let userName = req.body.username;
    let password = req.body.password;

    // TODO 校验格式
    // TODO XSS
    // TODO SQL 注入
    // 校验用户名
    if (!userName) {
        let err = new Error("没有传递参数username!");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    // 校验密码
    if (!password) {
        let err = new Error("没有传递参数password!");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (!nick) {
        let err = new Error('没有传递参数 nick');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (userName.length < 6 || userName.length > 10) {
        let err = new Error("用户名 长度(6-10)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (password.length < 6 || password.length > 16) {
        let err = new Error("密码 长度(6-16)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (nick.length < 2 || nick.length > 8) {
        let err = new Error("昵称 长度(2-8)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    let clientInfo = {
        ua: ua,
        ip: ip
    };
    try {
        let user = await userService.register(userName, password, nick, eid, clientInfo);
        if (!user) {
            let err = new Error("注册失败!");
            err.code = responseCode.SERVER_ERROR;
            err.status = 200;
            return next(err);
        }
        // 生成token
        let payload = {
            uid: user.id,
            nick: user.nick,
            avatar: user.avatar,
        };
        let token = await jwt.sign(payload);
        let data = {
            uid: user.id,
            nick: user.nick,
            avatar: user.avatar,
            gold: user.gold,
            token: token
        };
        res.success(data);
    } catch (err) {
        next(err);
        logger.error(err);
    }
}


/**
 * 用户名，密码登录
 * */
async function loginByUserName(req, res, next) {
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;   // 取出客户端ip
    let ua = req.get('User-Agent') || '';

    let userName = req.body.username;
    let password = req.body.password;

    // 校验用户名
    if (!userName) {
        let err = new Error("没有传递参数username!");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    // 校验密码
    if (!password) {
        let err = new Error("没有传递参数password!");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (userName.length < 6 || userName.length > 10) {
        let err = new Error("用户名 长度(6-10)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    if (password.length < 6 || password.length > 16) {
        let err = new Error("密码 长度(6-16)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    // 客户端信息
    let clientInfo = {
        ip: ip,
        ua: ua
    };
    try {
        let user = await userService.loginByUserNamePsw(userName, password, clientInfo);
        // 用户不存在
        if (!user) {
            let err = new Error("用户不存在");
            err.code = responseCode.SUCCESS;
            err.status = 200;
            return next(err);
        }
        // 用户被禁用
        if (!userService.isEnable(user)) {
            let err = new Error("该用户已被封禁！");
            err.code = responseCode.SUCCESS;
            err.status = 200;
            return next(err);
        }

        // 生成token
        let payload = {
            uid: user.id,
            nick: user.nick,
            avatar: user.avatar,
        };
        let token = await jwt.sign(payload);
        let data = {
            uid: user.id,
            nick: user.nick,
            avatar: user.avatar,
            gold: user.gold,
            token: token
        };
        res.success(data);
    } catch (err) {
        next(err);
        logger.error(err);
    }
}

/**
 * token 登录
 * */
async function loginByToken(req, res, next) {
    let token = req.get('Authorization');     // 取出 header Authorization token
    let ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;   // 取出客户端ip
    let ua = req.get('User-Agent') || '';

    if (!token) {
        let err = new Error("没有传递参数token!");
        err.code = responseCode.NOT_LOGIN;
        err.status = 200;
        return next(err);
    }
    // 客户端信息
    let clientInfo = {
        ua: ua,
        ip: ip
    };
    try {
        let user = await userService.loginByToken(token, clientInfo);
        // 用户不存在
        if (!user) {
            let err = new Error("用户不存在");
            err.code = responseCode.SUCCESS;
            err.status = 200;
            return next(err);
        }
        // 用户被禁用
        if (!userService.isEnable(user)) {
            let err = new Error("该用户已被封禁！");
            err.code = responseCode.SUCCESS;
            err.status = 200;
            return next(err);
        }
        let data = {
            uid: user.id,
            nick: user.nick,
            avatar: user.avatar,
            sex: user.sex,
            gold: user.gold,
            token: token
        };
        res.success(data);
    } catch (err) {
        next(err);
        logger.error(err);
    }
}
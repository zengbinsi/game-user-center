/**
 * 玩家
 */

const router = require('express').Router();

const responseCode = require('../constants/response_code');

const checkLogin = require('../middleware/check_login');

const userService = require('../services/user');

const logger = require('../lib/logger');

module.exports = function (app) {
    app.use('/account/user', router);
    router.get('/', checkLogin, getUserInfo);
    router.post('/reset_password', resetPassWord);
    router.post('/update_password', checkLogin, updatePassWord);
};

/**
 * 修改密码
 * */
async function updatePassWord(req, res, next) {
    let uid = req.user.uid;

    let oldPassWord = req.body.old_password;
    let newPassWord = req.body.new_password;

    if (!oldPassWord) {
        let err = new Error('请输入旧密码!');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        next(err);
        return;
    }
    if (!newPassWord) {
        let err = new Error('请输入新密码!');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        next(err);
        return;
    }
    if (newPassWord.length < 6 || newPassWord.length > 16) {
        let err = new Error("密码 长度(6-16)");
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        return next(err);
    }
    try {
        let result = await userService.updatePassWord(uid, oldPassWord, newPassWord);
        // 重置密码成功
        if (result) {
            res.success({});
        } else {
            let err = new Error('重置密码失败!');
            err.code = responseCode.PARAMS_ERROR;
            err.status = 200;
            next(err);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 重置密码
 * */
async function resetPassWord(req, res, next) {
    let uid = req.body.uid;

    if (!uid) {
        let err = new Error('请传入用户id!');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        next(err);
        return;
    }
    try {
        let result = await userService.resetPassWord(uid);
        // 重置密码成功
        if (result) {
            res.success({});
        } else {
            let err = new Error('重置密码失败!');
            err.code = responseCode.ERROR;
            err.status = 200;
            next(err);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/**
 * 获取用户信息
 * */
async function getUserInfo(req, res, next) {
    let uid = req.user.uid;
    try {
        let userInfo = await userService.getUserInfo(uid);
        // 重置密码成功
        if (userInfo) {
            res.success({
                uid: userInfo.id,
                nick: userInfo.nick,
                avatar: userInfo.avatar,
                sex: userInfo.sex,
                gold: userInfo.gold
            });
        } else {
            let err = new Error('获取用户信息失败!');
            err.code = responseCode.ERROR;
            err.status = 200;
            next(err);
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}



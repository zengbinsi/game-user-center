/**
 *
 *
 * */
const responseCode = require('../constants/response_code');

const jwt = require('../lib/jwt');


/**
 * 判断用户是否已经登录
 * */
module.exports = async function (req, res, next) {
    let token = req.get("Authorization");

    if (!token) {
        let err = new Error("用户未登录！");
        err.status = 200;
        err.status = responseCode.NOT_LOGIN;
        return next(err);
    }
    try {
        let payLoad = await jwt.verify(token);
        if (!payLoad || !payLoad.uid) {
            let err = new Error("用户未登录！");
            err.status = 200;
            err.status = responseCode.NOT_LOGIN;
            return next(err);
        }
        // 把用户信息挂载到request对象上
        req.user = payLoad;
        next();
    } catch (err) {
        next(err);
    }
};

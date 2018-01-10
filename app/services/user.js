/**
 * 用户 Services
 *
 * */
const userModel = require('../models').user;

const logger = require('../lib/logger');
const jwt = require('../lib/jwt');
const util = require('../lib/util');

const uuid = require('uuid/v4');

const userDao = require('../dao/user');
const loginHistoryDao = require('../dao/login_history');

const userConstant = require('../constants/user');
const responseCode = require('../constants/response_code');

const walletService = require('./wallet');
const safeBoxService = require('./safe_box');
const sensitiveService = require('./sensitive_words');
const gameWeightService = require('./game_weight');

/**
 * 注册用户
 *
 * @param {String} username      用户名
 * @param {String} password      密码
 * @param {String} nick          昵称
 * @param {String} eid           推广员id
 * @param {Object} clientInfo    客户端信息
 * */
async function register(username, password, nick, eid, clientInfo) {
    // 敏感词
    let sensitiveResult = sensitiveService.checkSensitiveWord(nick);
    if (sensitiveResult) {
        let err = new Error("昵称包含敏感词！");
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 判断username是否已被使用
    let userNameResult = await userDao.findByUserName(username);
    // 用户名已被使用
    if (userNameResult) {
        let err = new Error("用户名已被使用！");
        err.status = 200;
        err.code = responseCode.ERROR;
        throw err;
    }
    let nickResult = await userDao.findByNick(nick);
    // 昵称已被使用
    if (nickResult) {
        let err = new Error("昵称已被使用！");
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    let salt = uuid();
    let cryptoPsw = util.md5Hash(password + salt);
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    let user = {
        username: username,
        password: cryptoPsw,
        salt: salt,
        nick: nick,
        eid: eid,
        sex: userConstant.SEX_MEN,
        type: userConstant.USER_TYPE_NORMAL,
        avatar: userConstant.avatar,
        register_ip: clientInfo.ip,
        status: userModel.ENABLE,
        register_time: nowTimeStamp,
    };
    let userSaveResult = await userDao.create(user);
    // 初始化钱包
    await walletService.initWallet(userSaveResult.id);
    // 初始化保险柜
    await safeBoxService.initSafeBox(userSaveResult.id);
    await gameWeightService.initGameWeight(userSaveResult.id);
    let wallet = await walletService.getWallet(userSaveResult.id);
    userSaveResult.gold = wallet.gold;
    // 保存登录记录
    await saveLoginInfo(userSaveResult.id, clientInfo);
    return userSaveResult;
}

/**
 * 用户名密码 登录
 *
 * @param {String} username      用户名
 * @param {String} password      密码
 * @param {Object} clientInfo    客户端信息
 * */
async function loginByUserNamePsw(username, password, clientInfo) {
    let salt = await userDao.findUserSalt(username);
    if (!salt) {
        return null;
    }
    let cryptoPsw = util.md5Hash(password + salt.salt);
    let user = await userDao.findByUserNamePwd(username, cryptoPsw);
    if (!user) {
        return null;
    }
    let wallet = await walletService.getWallet(user.id);
    // 保存登录记录
    await saveLoginInfo(user.id, clientInfo);
    user.gold = wallet.gold;
    return user;
}

/**
 * token 登录
 *
 * @param {String} token         token
 * @param {Object} clientInfo    客户端信息
 * */
async function loginByToken(token, clientInfo) {
    let payload = await jwt.verify(token);
    let user = await findUserById(payload.uid);

    // 用户不存在
    if (!user) {
        return null;
    }
    let wallet = await walletService.getWallet(user.id);
    // 保存登录记录
    await saveLoginInfo(user.id, clientInfo);
    user.gold = wallet.gold;
    return user;
}


/**
 * 根据用户id查找用户信息
 * */
async function findUserById(uid) {
    try {
        return await userDao.findByUId(uid);
    } catch (err) {
        logger.error(err);
    }
}


/**
 * 根据用户id修改用户信息
 * */
async function updateById(uid, newUser) {
    return userDao.update(uid, newUser);
}

/**
 * 判断用户是否可用
 * */
function isEnable(user) {
    return user.status === userModel.ENABLE;
}

/**
 * 保存登录信息
 * */
async function saveLoginInfo(uid, clientInfo) {
    let loginHistory = {
        uid: uid,
        login_ip: clientInfo.ip,
        user_agent: clientInfo.ua,
    };
    // 保存登录记录
    return await loginHistoryDao.create(loginHistory);
}

/**
 * 重置密码
 * */
async function resetPassWord(uid) {
    let defaultPassWord = userConstant.DEFAULT_PASSWORD;
    // 重置密码
    let salt = uuid();
    let cryptoPsw = util.md5Hash(defaultPassWord + salt);
    return await userDao.updatePassWord(uid, salt, cryptoPsw);
}

/**
 * 修改密码
 *
 * @param {Number} uid 玩家id
 * @param {String} oldPassWord 旧密码
 * @param {String} newPassWord 新密码
 * */
async function updatePassWord(uid, oldPassWord, newPassWord) {
    let user = await userDao.findByUId(uid);
    if (!user) {
        return null;
    }
    console.log('updatePassWord ', user.salt);
    console.log('oldPassWord ', oldPassWord);
    // 判断旧密码是否正确
    let saltPassWord = util.md5Hash(oldPassWord + user.salt);
    console.log('saltPassWord ', saltPassWord);
    if (saltPassWord !== user.password) {
        let err = new Error('旧密码不正确！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 判断密码格式是否正确
    if (newPassWord.length < 6 || newPassWord.length > 16) {
        let err = new Error('新密码格式不正确 （6-16）！');
        err.code = responseCode.ERROR;
        err.status = 200;
        throw err;
    }
    // 更新密码
    let salt = uuid();
    let newCrytpoPsw = util.md5Hash(newPassWord + salt);
    return await userDao.updatePassWord(uid, salt, newCrytpoPsw);
}

/**
 * 获取玩家信息
 * @param {Number} uid 玩家id
 * */
async function getUserInfo(uid) {
    let user = await userDao.findByUId(uid);
    if (!user) {
        return null;
    }
    let wallet = await walletService.getWallet(uid);
    user.gold = wallet.gold;
    return user;
}

let userService = {
    register: register,
    updateById: updateById,
    loginByToken: loginByToken,
    loginByUserNamePsw: loginByUserNamePsw,
    isEnable: isEnable,
    resetPassWord: resetPassWord,
    updatePassWord: updatePassWord,
    getUserInfo: getUserInfo,
};

module.exports = userService;
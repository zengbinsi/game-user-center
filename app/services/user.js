/**
 * 用户 Services
 *
 * */

const userDao = require('../dao/user');
const loginHistoryDao = require('../dao/login_history');

const walletDao = require('../dao/wallet');
const registerConfigDao = require('../dao/register_config');
const walletLogDao = require('../dao/wallet_log');

const walletLogModel = require('../models').walletLog;
const userModel = require('../models').user;


const logger = require('../lib/logger');
const jwt = require('../lib/jwt');
const util = require('../lib/util');

const walletService = require('./wallet');

const userConstant = require('../constants/user');
const uuid = require('uuid/v4');

const responseCode = require('../constants/response_code');

/**
 * 注册微信用户
 *
 * @param {String} username      用户名
 * @param {String} password      密码
 * @param {String} nick          昵称
 * @param {String} eid           推广员id
 * @param {Object} clientInfo    客户端信息
 * */
async function register(username, password, nick, eid, clientInfo) {
    // 判断username是否已被使用
    // 判断昵称是否已被使用
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
        avatar: userConstant.avatar,
        register_ip: clientInfo.ip,
        register_time: nowTimeStamp,
    };
    let userSaveResult = await userDao.create(user);
    // 初始化钱包
    await initWallet(userSaveResult.id);

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
 * 注册时，初始化钱包
 * */
async function initWallet(uid) {
    // 注册配置信息：注册送多少金币
    let registerConfig = await registerConfigDao.get('gold');
    let walletLog = {
        uid: uid,
        amount: registerConfig.gold,
        reason: walletLogModel.REASON.REGISTER,
    };
    let wallet = {
        uid: uid,
        gold: registerConfig.gold
    };
    await walletLogDao.insert(walletLog);
    await walletDao.create(wallet);
}

let userService = {
    register: register,
    updateById: updateById,
    loginByToken: loginByToken,
    loginByUserNamePsw: loginByUserNamePsw,
    isEnable: isEnable,
};

module.exports = userService;
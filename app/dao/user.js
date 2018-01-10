/**
 * User DAO
 *
 */

let userModel = require('../models').user;


/**
 * 根据id查找用户
 */
async function findByUId(uid) {
    return await userModel.findOne({
        where: {
            id: uid
        },
        attributes: [
            'id', 'nick',
            'avatar', 'status',
            'type', 'sex',
            'salt', 'password',
        ]
    });
}

/**
 * 根据username查找用户
 * @param {String} userName
 */
async function findByUserName(userName) {
    return await userModel.findOne({
        where: {
            username: userName
        },
        attributes: [
            'id', 'nick',
            'avatar', 'status',
            'type', 'sex',
        ]
    });
}

/**
 * 根据username和密码查找用户
 * @param {String} userName
 * @param {String} passWord
 */
async function findByUserNamePwd(userName, passWord) {
    return await userModel.findOne({
        where: {
            username: userName,
            password: passWord,
        },
        attributes: [
            'id', 'nick',
            'avatar', 'status',
            'type', 'sex',
        ]
    });
}

/**
 * 根据nick查找用户
 * @param {String} nick
 */
async function findByNick(nick) {
    return await userModel.findOne({
        where: {
            nick: nick
        },
        attributes: [
            'id', 'nick',
            'avatar', 'status',
            'type', 'sex'
        ]
    });
}

/**
 * 根据用户名查找对应的密码盐
 * */
async function findUserSalt(username) {
    return await userModel.findOne({
        where: {
            username: username
        },
        attributes: [
            'salt',
        ]
    });
}

/**
 * 保存用户信息
 * */
async function create(user) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    user.created_at = nowTimeStamp;
    user.updated_at = nowTimeStamp;

    return await userModel.create(user);
}

/**
 * 修改用户信息
 *
 * @param {Number} uid 用户id
 * @param {Object} props 要修改的属性
 * */
async function update(uid, props) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    let user = await findByUId(uid);
    if (!user) {
        return null;
    }
    if (props.nick) {
        user.nick = props.nick;
        user.updated_at = nowTimeStamp;
    }
    if (props.avatar) {
        user.avatar = props.avatar;
        user.updated_at = nowTimeStamp;
    }
    if (props.sex != null && props.sex !== undefined && props.sex !== '') {
        user.sex = props.sex;
        user.updated_at = nowTimeStamp;
    }
    return await user.save();
}

/**
 * 修改密码
 *
 * @param {Number} uid 玩家id
 * @param {String} salt 密码盐
 * @param {String} password 玩家密码
 * */
async function updatePassWord(uid, salt, password) {

    let user = await findByUId(uid);
    if (!user) {
        return null;
    }
    if (salt != null && salt != undefined) {
        let time = parseInt(new Date().getTime() / 1000);
        if (password != null && password != undefined) {
            user.salt = salt;
            user.password = password;
            user.updated_at = time;
        }
    }
    return await user.save();
}

let userDao = {
    findByUId: findByUId,
    create: create,
    update: update,
    findByNick: findByNick,
    findByUserName: findByUserName,
    findByUserNamePwd: findByUserNamePwd,
    findUserSalt: findUserSalt,
    updatePassWord: updatePassWord
};
module.exports = userDao;

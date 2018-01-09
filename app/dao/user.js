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
            'type',
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
            'type',
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
            'type',
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
            'type'
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
 * */
async function update(uid, props) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    let user = await this.findByUId(uid);
    if (!user) {
        return null;
    }
    let newUser = {
        nick: props.nick || user.nick,
        avatar: props.avatar || user.avatar,
        sex: props.sex || user.sex,
        updated_at: nowTimeStamp,
    };
    return await user.update(newUser);
}

let userDao = {
        findByUId: findByUId,
        create: create,
        update: update,
        findByNick: findByNick,
        findByUserName: findByUserName,
        findByUserNamePwd: findByUserNamePwd,
        findUserSalt: findUserSalt
    }
;
module.exports = userDao;

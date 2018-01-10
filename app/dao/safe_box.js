/**
 * 保险柜 DAO
 * */

let safeBoxModel = require('../models').safeBox;

/**
 *  创建保险箱
 * */
async function create(safeBox) {
    let time = parseInt(new Date().getTime() / 1000);
    safeBox.created_at = time;
    safeBox.updated_at = time;
    return await safeBoxModel.create(safeBox);
}

/**
 * 查询用户保险箱
 *
 * @param {Number} uid 用户id
 * */
async function findById(uid) {
    return await safeBoxModel.findOne({
        where: {
            uid: uid,
        }
    });
}

/**
 * 更改保险箱
 *
 * @param {Number} uid 用户id
 * @param {Object} property 要修改的属性
 * */
async function update(uid, property) {
    let safeBox = await findById(uid);

    let time = parseInt(new Date().getTime() / 1000);
    if (!safeBox) {
        return null;
    }
    if (property.password != null && property.password !== undefined) {
        safeBox.password = property.password;
        safeBox.updated_at = time;
    }
    if (property.gold != null && property.gold !== undefined) {
        safeBox.gold = property.gold;
        safeBox.updated_at = time;
    }
    return await  safeBox.save();
}

let safeBoxDao = {
    create: create,
    findById: findById,
    update: update,
};

module.exports = safeBoxDao;
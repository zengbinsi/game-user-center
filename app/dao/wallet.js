/**
 * 钱包
 * */


let walletModel = require('../models').wallet;


/**
 * 查询用户钱包
 * */
async function findByUId(uid) {
    let wallet = await walletModel.findOne({
        where: {
            uid: uid
        },
        attributes: [
            'id',
            'uid',
            'gold']
    });
    return wallet;
}

/**
 * 用户钱包
 * */
async function create(wallet) {
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    wallet.created_at = nowTimeStamp;
    wallet.updated_at = nowTimeStamp;
    return await walletModel.create(wallet);
}


/**
 * 更新用户钱包
 *
 * @param {Number} uid 用户id
 * @param {Object} property 要修改的属性
 * */
async function update(uid, property) {
    let wallet = await findByUId(uid);
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    if (property.gold != null && property.gold !== undefined && property.gold != '') {
        wallet.gold = property.gold;
        wallet.updated_at = nowTimeStamp;
    }
    return wallet.save();
}

let walletDao = {
    update: update,
    create: create,
    findByUId: findByUId
};
module.exports = walletDao;

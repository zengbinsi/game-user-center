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
 * 更新用户金币
 * */
async function updateGold(uid, gold) {
    let wallet = await walletDao.findByUId(uid);
    let nowTimeStamp = parseInt(new Date().getTime() / 1000);

    wallet.gold = gold;
    wallet.updated_at = nowTimeStamp;

    return await wallet.save();
}

let walletDao = {
    updateGold: updateGold,
    create: create,
    findByUId: findByUId
};
module.exports = walletDao;

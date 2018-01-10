/**
 * 玩家权重 DAO
 * */
const gameWeightModel = require('../models').gameWeight;

/**
 * 创建玩家权重
 * */
async function create(game_weight) {
    let time = parseInt(new Date() / 1000);
    game_weight.created_at = time;
    game_weight.updated_at = time;
    return await gameWeightModel.create(game_weight);
}

/**
 * 修改玩家权重
 * */
async function update(uid, property) {
    let gameWeight = await findByUid(uid);
    if (!gameWeight) {
        return null;
    }
    let time = parseInt(new Date().getTime() / 1000);
    // 当前权重
    if (property.weight !== null && property.weight !== undefined) {
        gameWeight.weight = property.weight;
        gameWeight.updated_at = time;
    }
    // 最小权重
    if (property.min_weight != null && property.min_weight !== undefined) {
        gameWeight.min_weight = property.min_weight;
        gameWeight.updated_at = time;
    }
    // 最大权重
    if (property.max_weight != null && property.max_weight !== undefined) {
        gameWeight.max_weight = property.max_weight;
        gameWeight.updated_at = time;
    }
    return await gameWeight.save();
}

/**
 * 查询玩家权重
 * */
async function findByUid(uid) {
    return await gameWeightModel.findOne({
        where: {
            uid: uid,
        },
        attribute: ['uid', 'weight', 'min_weight', 'max_weight']
    });
}

let gameWeightDao = {
    create: create,
    update: update,
    findByUid: findByUid
};
module.exports = gameWeightDao;
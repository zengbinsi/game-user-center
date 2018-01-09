/**
 * 权重
 * */

const gameWeightDao = require('../dao/game_weight');
const registerConfigDao = require('../dao/register_config');

const gameWeightConstant = require('../constants/game_weight');

/**
 * 根据用户id 查询
 * */
async function findByUId(uid) {
    return await gameWeightDao.findByUid(uid);
}

/**
 * 修改玩家权重
 * */
async function update(uid, property) {
    let gameWeight = await findByUId(uid);

    if (gameWeight) {
        if (property.min_weight !== null && property.min_weight !== undefined && property.max_weight != '') {
            gameWeight.min_weight = property.min_weight;
        }
        //
        if (property.max_weight !== null && property.max_weight !== undefined && property.max_weight != '') {
            gameWeight.max_weight = property.max_weight;
        }
        if (property.weight !== null && property.weight !== undefined && property.max_weight != '') {
            gameWeight.weight = property.weight;
        }
        await gameWeight.save();
        return gameWeight;
    }
}

/**
 * 初始化玩家权重
 * */
async function initGameWeight(uid) {
    let minWeight = await registerConfigDao.get(gameWeightConstant.MIN_WEIGHT_KEY);
    let maxWeight = await registerConfigDao.get(gameWeightConstant.MAX_WEIGHT_KEY);
    let defaultWeight = await registerConfigDao.get(gameWeightConstant.DEFAULT_WEIGHT_KEY);

    let gameWeight = {
        uid: uid,
        min_weight: minWeight.value || gameWeightConstant.MIN_WEIGHT,
        max_weight: maxWeight.value || gameWeightConstant.MAX_WEIGHT,
        weight: defaultWeight.value || gameWeightConstant.DEFAULT_WEIGHT,
    };
    return await gameWeightDao.create(gameWeight);
}

let gameWeightService = {
    initGameWeight: initGameWeight,
    findByUId: findByUId,
    update: update,
};
module.exports = gameWeightService;
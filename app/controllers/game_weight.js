/**
 *玩家权重
 * */

const router = require('express').Router();

const logger = require('../lib/logger');

const responseCode = require('../constants/response_code');
const gameWeightService = require('../services/game_weight');

module.exports = function (app) {
    app.use('/account/game_weight', router);

    router.get('/', getGameWeight);
    router.post('/update', updateGameWeight);
};

/**
 * 获取玩家权重
 *
 */
async function getGameWeight(req, res, next) {
    try {
        let uid = req.query.uid;
        if (!uid) {
            let err = new Error('参数错误！');
            err.code = responseCode.PARAMS_ERROR;
            err.status = 200;
            next(err);
            return;
        }
        let gameWeight = await gameWeightService.findByUId(uid);
        if (!gameWeight) {
            res.success({});
        } else {
            res.success({
                uid: gameWeight.uid,
                min_weight: gameWeight.min_weight,
                max_weight: gameWeight.max_weight,
                weight: gameWeight.weight,
            });
        }
    } catch (err) {
        logger.error(err);
    }
}

/**
 * 修改玩家权重
 * */
async function updateGameWeight(req, res, next) {
    let uid = req.body.uid;
    let weight = req.body.weight;
    let max_weight = req.body.max_weight;
    let min_weight = req.body.min_weight;

    if (!uid) {
        let err = new Error('参数错误！');
        err.code = responseCode.PARAMS_ERROR;
        err.status = 200;
        next(err);
        return;
    }
    try {
        let updateResult = await gameWeightService.update(uid, {
            weight: weight,
            min_weight: min_weight,
            max_weight: max_weight,
        });
        if (updateResult) {
            res.success({
                uid: updateResult.uid,
                weight: parseInt(updateResult.weight),
                min_weight: parseInt(updateResult.min_weight),
                max_weight: parseInt(updateResult.max_weight),
            })
        } else {
            let err = new Error('修改权重失败！');
            err.code = responseCode.ERROR;
            err.status = 200;
            next(err);
        }
    } catch (err) {

    }
}

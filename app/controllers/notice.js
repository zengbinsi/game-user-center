/**
 * 公告
 * */

const express = require('express');
const router = express.Router();

const noticeService = require('../services/notice');

const logger = require('../lib/logger');

module.exports = function (app) {
    app.use('/account/notice', router);
};

router.get('/', getIndexNotice);

/**
 * 获取首页公告,
 * */
async function getIndexNotice(req, res, next) {
    try {
        let notice = await noticeService.getIndexNotice();

        if (notice) {
            let data = {
                id: notice.id,
                title: notice.title,
                content: notice.content,
            };
            res.success(data);
        } else {
            res.success({});
        }
    } catch (err) {
        next(err);
        logger.error(err);
    }
}


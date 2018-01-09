/**
 * notice DAO
 * */
const noticeModel = require('../models').notice;

/**
 * 获取首页公告
 * 状态为启用
 * */
exports.getIndexNotice = async function () {
    let notice = await noticeModel.findOne({
        where: {
            status: noticeModel.ENABLE,
        },
        attributes: [
            'id',
            'content', 'title',
            'start_time', 'expire_time',]
    });
    return notice;
};

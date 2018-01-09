/**
 * 公告
 * */

const noticeDao = require('../dao/notice');


/**
 * 首页公告
 * */
async function getIndexNotice() {
    let notice = await noticeDao.getIndexNotice();
    return notice;
}

let noticeService = {getIndexNotice: getIndexNotice};

module.exports = noticeService;
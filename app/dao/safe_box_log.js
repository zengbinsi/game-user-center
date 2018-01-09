/**
 * 保险柜操作记录 DAO
 * */

const safeBoxLogModel = require('../models').safeBoxLog;


/**
 * 保存保险柜操作记录
 *
 * */
async function insert(safeBoxLog) {
    let time = parseInt(new Date().getTime() / 1000);

    safeBoxLog.time = time;
    safeBoxLog.created_at = time;
    safeBoxLog.updated_at = time;
    return safeBoxLogModel.create(safeBoxLog);
}

/**
 * 查询转账给其它用户记录
 * */

/**
 * 查询转入记录
 * */

let safeBoxLogDao = {
    insert: insert,
};
module.exports = safeBoxLogDao;
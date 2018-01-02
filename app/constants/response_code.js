/**
 * 响应码
 *
 */
module.exports = {
    // 成功
    SUCCESS: 200,

    // 未登录
    NOT_LOGIN: 401,
    // 没有权限
    NOT_PERMISSION: 403,

    // 参数错误
    PARAMS_ERROR: 422,
    // 请求过于频繁
    TOO_MANY_REQUESTS: 429,

    // 业务逻辑错误
    ERROR: 1000,

    // 服务器异常
    SERVER_ERROR: 500,
};

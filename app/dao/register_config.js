/**
 * 注册配置 DAO
 * */

const registerConfigModel = require('../models').registerConfig;

/**
 * 获取注册配置
 * */
async function get(key) {
	if (key) {
		let config = await registerConfigModel.findOne({
			where: {
				key: key
			}
		});
	    if (config) {
	        return config.value;
	    }
	    return;
	}

    let configs = await registerConfigModel.findAll();
    if (configs && configs.length > 0) {
        return configs[0];
    }
}

module.exports = {
    get: get
};



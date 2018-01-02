const express = require('express'),
    config = require('./config/config'),
    db = require('./app/models');

const path = require('path');

const app = express();

const logger = require('./app/lib/logger');

module.exports = require('./config/express')(app, config);

db.sequelize
    .sync()
    .then(function () {
        if (!module.parent) {
            app.listen(config.port, function () {
                console.log('Express server listening on port ' + config.port);
                logger.init(path.join(config.root, 'logs'));
            });
        }
    }).catch(function (e) {
    throw new Error(e);
});


const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        root: rootPath,
        app: {
            name: 'game-user-center'
        },
        port: process.env.PORT || 4000,
        tokenSecret: "VIQtmes8z2NJM3ILdT2WSfK7CFvvwcyT",
    },

    production: {
        root: rootPath,
        app: {
            name: 'game-user-center'
        },
        port: process.env.PORT || 4000,
        tokenSecret: "VIQtmes8z2NJM3ILdT2WSfK7CFvvwcyT",
    }
};

module.exports = config[env];

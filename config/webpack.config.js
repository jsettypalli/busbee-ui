const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const ENV = process.env.IONIC_ENV;
const envConfigFile = require(`./config-${ENV}.json`);
const baseUrlConfig = envConfigFile.baseUrl;

webpackConfig[process.env.IONIC_ENV].plugins.push(
    new webpack.DefinePlugin({
        webpackGlobalVars: {
            baseUrl: JSON.stringify(baseUrlConfig)
        }
    })
);

const WorkerPlugin = require('worker-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
    webpack: function (config, env) {
        const isDevelopment = env === 'development';

        // ...add your webpack config
        config.plugins.push(
            new WorkerPlugin()
        )

        if (isDevelopment) {
            config.plugins.push(new ReactRefreshWebpackPlugin());
        }

        return config;
    }
}
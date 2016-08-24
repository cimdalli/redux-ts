const path = require("path");
const nodeExternals = require('webpack-node-externals');

const config = {
    externals: nodeExternals(),
    output: {
        library: 'ReduxTs',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    }
};

module.exports = config;
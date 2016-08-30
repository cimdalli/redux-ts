const path = require("path");
const glob = require("glob");
const webpack = require("webpack");


const config = {
    entry: glob.sync("./src/**/*.spec.ts"),
    output: {
        path: './lib',
        filename: 'specs.js',
        library: 'ReduxTs',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    externals: ['mocha'],
    // devtool: 'inline-source-map',
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader',
                query: {
                    tsconfig: 'test/tsconfig.json'
                }
            }
        ]
    },
    progress: true,
    colors: true
};

module.exports = config;
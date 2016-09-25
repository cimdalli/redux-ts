const webpack = require("webpack");
const glob = require("glob");
const nodeExternals = require('webpack-node-externals');

const env = process.env.NODE_ENV;
const isDev = env == "dev";
const isTest = env == "test";
const isProd = env == "prod";

const config = {
    externals: [isTest ? "mocha" : nodeExternals()],
    entry: isTest ? glob.sync("./src/**/*.spec.ts") : null,
    output: {
        library: 'ReduxTs',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript',
                query: {
                    declaration: isDev,
                    sourceMap: true
                }
            }
        ]

    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ]
};

module.exports = config;
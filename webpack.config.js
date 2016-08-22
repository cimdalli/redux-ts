const path = require("path");

var reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
}

var reduxExternal = {
    root: 'Redux',
    commonjs2: 'redux',
    commonjs: 'redux',
    amd: 'redux'
}

var config = {
    externals: {
        'react': reactExternal,
        'redux': reduxExternal
    },
    output: {
        // filename: path.resolve(__dirname, 'dist', 'redux-ts.js')
        library: 'ReduxTs',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = config;
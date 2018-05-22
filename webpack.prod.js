const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    library: 'ReduxTs',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
    filename: 'redux-ts.production.min.js',
  },
})

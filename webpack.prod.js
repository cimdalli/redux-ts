const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    library: "ReduxTs",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this",
    filename: "redux-ts.min.js"
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          mangle: {
            keep_fnames: true
          }
        }
      })
    ]
  }
})

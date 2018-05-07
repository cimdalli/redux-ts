const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  externals: [nodeExternals()],
  entry: "./src/index.ts",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: true,
                sourceMap: true
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    // new webpack.DefinePlugin({
    //   "process.env.NODE_ENV": JSON.stringify(env)
    // }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: "[file].map"
    // })
  ]
}

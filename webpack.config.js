const path = require('path')

module.exports = {
  mode: 'development', // 或者 'production'，具體取決於你的需求
  entry: './pages/index.js', // 你的入口文件
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有的.js文件
        exclude: /node_modules/, // 排除node_modules目錄
        use: {
          loader: 'babel-loader', // 使用babel-loader進行轉換
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // 使用的Babel預設配置
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false, // 或者 require.resolve('browserify-fs')
      stream: false, // 或者 require.resolve('stream-browserify')
      zlib: false, // 或者 require.resolve('browserify-zlib')
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 80,
  },
}

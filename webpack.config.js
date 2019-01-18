const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    './client/index'
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};

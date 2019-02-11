const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  entry: {
    index: './client/index',
    internal: './client/internal',
    external: './client/external'
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, './public/js')
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

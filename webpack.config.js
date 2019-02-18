const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  devtool: 'none',
  entry: {
    index: './client/index',
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
        exclude: p => p.match(/node_modules/) && !p.match(/@joefitter\/docx/),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  targets: {
                    ie: 11
                  }
                }
              ]
            ],
            'plugins': [
              '@babel/plugin-proposal-object-rest-spread',
              'transform-class-properties'
            ]
          }

        }
      }
    ]
  }
};

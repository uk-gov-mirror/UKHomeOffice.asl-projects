const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  entry: {
    index: './lib/client'
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, './public/js')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path => path.match(/node_modules/) && !path.match(/node_modules\/@asl/),
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

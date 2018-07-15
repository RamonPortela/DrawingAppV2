const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './public/scripts'),
  entry: {
    app: './index.js',
  },
  output: {
    filename: 'index.min.js',
    publicPath: '/scripts',
    path: path.resolve(__dirname, './public/scripts'),
  },
  devServer:
  {
    contentBase: path.resolve(__dirname, './public'),
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

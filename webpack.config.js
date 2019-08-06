const path = require('path');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'ui', 'index.ts'),
    plugin: path.join(__dirname, 'src', 'plugin.ts'),
  },
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  output: {
    path: path.join(__dirname, 'plugin'),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }],
  },
  plugins: [
    new HTMLWebpackPlugin({
      inject: 'head',
      inlineSource: '.(js)$',
      chunks: ['index'],
      minify: true,
      template: path.join(__dirname, 'index.html'),
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'manifest.json'),
      to: path.join(__dirname, 'plugin', 'manifest.json'),
    }]),
  ].concat(
    isProd ? new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.join(__dirname, 'plugin'),
      cleanAfterEveryBuildPatterns: path.join(__dirname, 'plugin', 'index.js'),
    }) : [],
  ),
};

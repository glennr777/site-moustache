const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: '[hash]-main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.ico$\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader'  // <-- retain original file name
       },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      },
      // {
      //   test: /\fragments\/.*\.ejs$/,
      //   loader: 'ejs-html-loader',
      // },
      { test: /\.ejs$/, use: 'ejs-compiled-loader' },
      //{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          },
        },
      },
      {
        test: /\.png$/,
        use: [{
          loader: 'url-loader?mimetype=image/png',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]',
          },
        }],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.template.ejs',
      inject: 'body',
      interpolate: true,
      favicon: './src/img/favicon.ico',
      esModule: false,
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[hash]-[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: './src/.htaccess',
        to: '.htaccess',
        toType: 'file',
      }],
    })
  ],
};

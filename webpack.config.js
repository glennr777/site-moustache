const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { htmlWebpackPluginTemplateCustomizer }  = require('template-ejs-loader');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const data = {};

module.exports = {
  entry: path.resolve('./src/main.js'),
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    assetModuleFilename: 'images/[name][ext]',
    hashFunction: 'xxhash64'
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
      {
        test: /\.ejs$/,
        use: ['html-loader', 'template-ejs-loader']
      },
      //{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: './src/img/favicon.ico',
      filename: 'index.html',
      template: htmlWebpackPluginTemplateCustomizer({
        templatePath:'./src/index.template.ejs', 
        templateEjsLoaderOption: {
          data,
        }
      }),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: './src/.htaccess',
        to: '.htaccess',
        toType: 'file',
      }],
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              cssDeclarationSorter: false,
            }
          ]
        }
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              webp: {
                lossless: true,
              },
            },
          },
        },
        generator: [
          {
            preset: "webp",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
  },
};

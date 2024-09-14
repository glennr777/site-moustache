const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const data = require('./site-data.json');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext]',
    hashFunction: 'xxhash64'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.(ico|woff|ttf|wav|mp3)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]', // keep original filename
        },
       },
      {
        test: /\.(jpe?g|png|svg)$/i,
        type: 'asset', // inline assest < 8kb
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlBundlerPlugin({
       entry: [
         // here you can define many templates as entrypoint, 
         // all source files of styles, scripts and favicon can be defined directly in template, see header.ejs
         {
           import: 'src/index.template.ejs',
           filename: 'index.html', // save generated HTML into dist/index.html
           // the `data` option to pass external data into template
           data: {
             // the `data` is the global object name what is used in template, e.g. data.prices
             data,
           },
         },
       ],
       js: {
         filename: 'js/[name].[contenthash:8].js', // JS output filename
       },
       css: {
         filename: 'css/[name].[contenthash:8].css', // CSS output filename
       },
       preprocessor: 'ejs', // use EJS templating engine
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
  // enable live reload
  devServer: {
    static: path.join(__dirname, 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};

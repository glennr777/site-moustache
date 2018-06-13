const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader?-autoprefixer&sourceMap=true&importLoaders=1', 'postcss-loader']
        })
      },
      {
        test: /\.ico$\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
       },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader'
      },
      {
        test: /\fragments\/.*\.ejs$/,
        loader: 'ejs-html-loader',
      },
      //{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.(jp(e*)g)$/,
        use: [{
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[hash]-[name].[ext]'
            }
        }]
      },{
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
    new HtmlWebpackPlugin({
      template: './src/index.template.ejs',
      inject: 'body',
      interpolate: true,
      favicon: './src/img/favicon.ico',
    }),
    new ExtractTextPlugin("styles.css"),
    new UglifyJsPlugin(),
  ],
};

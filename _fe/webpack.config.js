var path = require('path');

var module_path = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var root_dir = path.dirname(__dirname);
var Cube = require('cube-js');
var SrainBlogPlugin = require('./src/srain-blog-plugin.js');

var name_for_img = "/img/[hash].[ext]";
var font_version = Cube.formatDate(new Date(), 'yyyyMMddhhmmss');
var name_for_font = "name=/fonts/[name].[ext]?v=" + font_version;

module.exports = {
  entry: {
    "base": ["jquery", "./src/base.js", "./src/js/global.js"],
    "app": "./src/js/blog.js",
    "404": "./src/js/404.js",
    "pick-alibaba-name": "./src/js/pick-alibaba-name.js",
  },
  output: {
    path: path.join(root_dir, '/assets/app'),
    publicPath: '/assets/app',
    filename: "js/[name].js",
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      exclude: module_path,
      loader: 'babel'
    },
    {
      test: /.*\.(gif|png|jpe?g)$/i,
      loader: "url?limit=10000&name=" + name_for_img
    },
    // loaders for bootstrap
    {
      test: /bootstrap-sass\/assets\/javascripts\//,
      loader: 'imports?jQuery=jquery',
    },
    {
      test: /bootstrap\/js\//,
      loader: 'imports?jQuery=jquery'
    },
    // fonts
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000&mimetype=application/font-woff&' + name_for_font,
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000&mimetype=application/octet-stream&' + name_for_font,
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml&' + name_for_font,
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file?' + name_for_font,
    },
    // Extract css files
    {
      test: /\.(css|less|scss)$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!less-loader?sourceMap!sass-loader?sourceMap")
    },
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/app.css", { allChunks: true }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new webpack.optimize.CommonsChunkPlugin('base', 'js/base.js'),
    new SrainBlogPlugin(),
  ]
};

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = require('../paths');
const plugins = require('./plugins');
const loaders = require('./loaders');

module.exports = {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',

  entry: [...paths.webpack.entry],

  output: {
    path: paths.webpack.output.path,
    chunkFilename: '[name].[chunkhash:4].js',
    filename: '[name].[chunkhash:8].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },

  module: {
    rules: [...loaders],
  },
  plugins: [...plugins],

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        sourceMap: true,
      }),

      new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['advanced', { discardComments: { removeAll: true } }],
        },
      }),
    ],

    namedModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]web_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};

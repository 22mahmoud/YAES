const path = require('path');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminWebp = require('imagemin-webp');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const PurgecssPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('../paths');

const htmls = () =>
  paths.html.glob.map((htmlPath) => {
    const template = path.relative(paths.root, htmlPath);
    const filename = template.split('/').slice(1).join('/');

    return new HtmlWebpackPlugin({
      filename,
      template,
      inject: 'head',
      minify: {
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
        sortClassName: true,
        sortAttributes: true,
        html5: true,
        decodeEntities: true,
      },
    });
  });

const criticalCssFiles = () =>
  paths.html.glob.map((htmlPath) => {
    const src = path
      .relative(paths.root, htmlPath)
      .split('/')
      .slice(1)
      .join('/');

    return new HtmlCriticalWebpackPlugin({
      base: paths.webpack.output.path,
      src,
      dest: src,
      inline: true,
      minify: true,
      extract: true,
      width: 375,
      height: 565,
      penthouse: {
        blockJSRequests: false,
      },
    });
  });

module.exports = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),

  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'build/assets',
        to: 'assets',
      },
      {
        from: 'build/images',
        to: 'images',
      },
      {
        from: '**/*.gif',
        context: 'build/',
        noErrorOnMissing: true,
      },
    ],
  }),

  ...htmls(),

  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css',
  }),

  new PurgecssPlugin({
    paths: paths.html.glob,
  }),
  new PreloadWebpackPlugin({
    rel: 'preload',
    as(entry) {
      if (/\.(woff2)$/.test(entry)) {
        return 'font';
      }
    },
    fileWhitelist: [/\.(woff2)$/],
    include: 'allAssets',
  }),

  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),

  ...criticalCssFiles(),

  new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg|webp)$/i,
    plugins: [
      imageminMozjpeg({
        quality: '70',
      }),
      imageminWebp({
        quality: 50,
      }),
    ],
  }),
];

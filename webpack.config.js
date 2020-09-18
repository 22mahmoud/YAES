const path = require('path');
const SriPlugin = require('webpack-subresource-integrity');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const imageminWebp = require('imagemin-webp');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

const cssRegex = /\.css$/;

const htmls = () =>
  paths.html.htmlGlob.map((htmlPath) => {
    const template = path.relative(__dirname, htmlPath);
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
  paths.html.htmlGlob.map((htmlPath) => {
    const src = path
      .relative(__dirname, htmlPath)
      .split('/')
      .slice(1)
      .join('/');

    return new HtmlCriticalWebpackPlugin({
      base: path.resolve(__dirname, 'public'),
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

const babelLoader = {
  test: /\.m?js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            useBuiltIns: 'entry',
            corejs: 3.6,
          },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: true,
      compact: true,
    },
  },
};

const cssLoader = {
  test: cssRegex,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const fileLoader = {
  exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[hash:8].[ext]',
      },
    },
  ],
};

const envConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

module.exports = {
  mode: 'production',
  target: 'web',
  devtool: 'source-map',

  entry: [
    path.resolve(__dirname, 'build/js/app.js'),
    path.resolve(__dirname, 'build/styles/main.css'),
  ],

  output: {
    path: path.resolve(__dirname, 'public'),
    chunkFilename: '[name].[chunkhash:4].js',
    filename: '[name].[chunkhash:8].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },

  module: {
    rules: [babelLoader, cssLoader, fileLoader],
  },
  plugins: [
    envConfig,
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
      paths: paths.html.htmlGlob,
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

    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: true,
    }),
  ],

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

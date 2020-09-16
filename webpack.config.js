const path = require('path');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const fg = require('fast-glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('./config/paths');

const cssRegex = /\.css$/;

const htmls = fg.sync('build/**/*.html', { dot: false }).map(
  (template) =>
    new HtmlWebpackPlugin({
      name: template.split('/').slice(1).join('/'),
      template,
      minify: true,
    })
);

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

  resolve: {
    modules: [path.resolve(__dirname, 'build/web_modules'), 'node_modules'],
  },

  entry: [
    path.resolve(__dirname, 'build/js/app.js'),
    path.resolve(__dirname, 'build/styles/main.css'),
  ],

  output: {
    path: path.resolve(__dirname, 'out'),
    chunkFilename: '[name].[chunkhash:4].js',
    filename: '[name].[chunkhash:8].js',
  },

  module: {
    rules: [babelLoader, cssLoader, fileLoader],
  },
  plugins: [
    envConfig,
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),

    new PurgecssPlugin({
      paths: fg.sync(paths.html.src, { dot: true }),
    }),

    new CopyPlugin({
      patterns: [
        { from: 'build/assets', to: 'assets' },
        {
          from: 'build/images',
          to: 'images',
        },
      ],
    }),

    ...htmls,

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
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        // TerserPlugin config is taken entirely from react-scripts
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {},
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),

      new OptimizeCssAssetsPlugin(),
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

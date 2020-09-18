const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssRegex = /\.css$/;

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

module.exports = [fileLoader, cssLoader, babelLoader];

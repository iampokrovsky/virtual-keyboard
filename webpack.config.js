const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const getFilename = (ext) => (isDev
  ? `[name].${ext}`
  : `[name].[contenthash].${ext}`);

const getCssLoaders = (extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const getPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      title: 'Virtual Keyboard',
      favicon: 'src/assets/favicon.svg',
      meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=1' },
      // template: path.resolve(__dirname, 'src/index.html'),
      minify: {
        collapseWhitespace: isProd,
      },
      fix: true,
    }),
    new MiniCssExtractPlugin({
      filename: getFilename('css'),
    }),
    new CleanWebpackPlugin(),
  ];

  if (isProd) {
    plugins.push(new ESLintWebpackPlugin({
      extensions: ['js'],
      fix: true,
    }));
  }

  return plugins;
};

module.exports = {
  entry: '@/index.js',
  mode: isProd ? 'production' : 'development',
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  devServer: {
    open: true,
    host: 'localhost',
    hot: true,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: getPlugins(),
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        generator: {
          filename: getFilename('html'),
        },
      },
      {
        test: /\.css$/,
        use: getCssLoaders(),
      },
      {
        test: /\.scss$/,
        use: getCssLoaders('sass-loader'),
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

    ],
  },
};

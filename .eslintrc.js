const path = require('path');

module.exports = {
  parser: '@babel/eslint-parser',
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, 'webpack.config.js'),
      },
    },
  },
  rules: {
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix'],
  },
  env: {
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    requireConfigFile: false,
  },
  extends: [
    'eslint-config-airbnb-base',
  ],
};

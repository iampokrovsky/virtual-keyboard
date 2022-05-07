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
  rules: {},
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

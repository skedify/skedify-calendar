const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  plugins: ['transform-polyfills'],
  presets: ['env', 'react'],
});

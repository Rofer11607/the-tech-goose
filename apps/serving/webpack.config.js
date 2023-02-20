const { merge } = require('webpack-merge');
const webpack = require('webpack')

module.exports = (config, context) => {
  return merge(config, {
    plugins: [new webpack.NoEmitOnErrorsPlugin()],
  });
};

'use strict';

var webpack = require('webpack');

var env = process.env.NODE_ENV;
var modType = process.env.MODTYPE; // 'umd' or undefined
var config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReduxLogicTest',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

if (modType === 'umd') {
  config.externals = {
    "redux": "Redux",
    "redux-logic": "ReduxLogic"
  };
}

module.exports = config;

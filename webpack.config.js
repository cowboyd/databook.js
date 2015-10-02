module.exports = {
  entry : './src/main.js',
  output: {
    path: __dirname,
    filename: 'dist/dataset.js'
  },
  module: {
    loaders: [{
      test: /.js$/,
      loader: 'babel-loader'
    }]
  }
};

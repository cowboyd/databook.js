module.exports = {
  entry  : './src/main.js',
  output : {
    path     : __dirname,
    filename : 'index.js'
  },
  module : {
    loaders: [{
      test   : /.js$/,
      loader : 'babel-loader'
    }]
  }
};

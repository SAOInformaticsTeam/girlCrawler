module.exports = {
  entry: [
    "babel-polyfill",
    "./main.js"
  ],
  output: {
    path: __dirname + '/output/',
    publicPath: "/output/",
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

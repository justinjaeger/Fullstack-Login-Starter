const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // publicPath: '/dist/',
  },
  devServer: {
    port: 8080,
    publicPath: '/dist/',
    contentBase: './client/src',
    proxy: {
      '/login': 'http://localhost:3000',
      '/signup': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
    },
    hot: true,
    historyApiFallback: true,
  },
  entry: path.resolve(__dirname, './client/src/index.jsx'),
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx',]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      // favicon: "./client/assets/favicon.ico"
    }),
    new CleanWebpackPlugin(),
  ]
}

/* 
  IF IT'S NOT WORKING FOR NO REASON: 
    rm -rf node_modules
    npm install
*/
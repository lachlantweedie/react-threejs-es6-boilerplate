const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {resolve} = require('path');
const bourbon = require('node-bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;

const sassLoader = {
  loader: "sass-loader",
  options: {
    data: '@import "src/scss/config/config.scss";',
    includePaths: [
      bourbon,
      neat,
      resolve(__dirname, 'node_modules'),
      resolve(__dirname, "src/scss/config")
    ]
  }
};

const CSSLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1
  }
};

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    includePaths: [resolve(__dirname, '')],
    plugins: function() {
      return [
        require('precss'), require('autoprefixer')({
          browsers: ['last 2 version', '> 5%', 'ie 9']
        })
      ];
    }
  }
};

module.exports = (env) => {
  return {
    entry: {
      app: env.prod
        ? ['./index.jsx']
        : [
          'react-hot-loader/patch', 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/only-dev-server', './index.jsx'
        ],
      vendor: ['react', 'lodash', 'three', '@tweenjs/tween.js']
    },
    output: {
      filename: 'bundle.[name].[hash].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: true
    },
    devServer: {
      stats: 'errors-only',
      historyApiFallback: true,
      hot: true,
      compress: true, // gzip
      open: true // open in browser and run
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod
      ? 'source-map'
      : 'eval',
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          use: [
            'babel-loader', 'eslint-loader'
          ],
          exclude: /node_modules/
        }, {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              CSSLoader, postCSSLoader, sassLoader
            ],
            // publicPath: 'dist/',
          })
        }, {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash].[ext]',
                outputPath: 'images/',
                // publicPath: 'images/',
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [
        '.js', '.jsx'
      ],
      modules: [
        resolve(__dirname, 'node_modules'),
        './src'
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({template: './index.html'}),
      new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
      new ExtractTextPlugin({filename: 'bundle.[contenthash].css', disable: false, allChunks: true})
    ]
  };
};

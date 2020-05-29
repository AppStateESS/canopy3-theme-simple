/* global module, __dirname */
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const sourceDir = path.resolve(__dirname, 'js')
const destDir = path.resolve(__dirname, 'dist')
const sourceSassDir = path.resolve(__dirname, 'scss')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (env, argv) => {
  const inProduction = argv.mode === 'production'
  const inDevelopment = argv.mode === 'development'

  const settings = {
    entry: {
      'js/bootstrap.js': sourceDir + '/bootstrap.js',
      'css/bootstrap.css': sourceSassDir + '/bootstrap.scss',
    },
    output: {
      path: destDir,
      filename: '[name]',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [new ExtractTextPlugin('css/bootstrap.css', {allChunks: true})],
    externals: {
      $: 'jQuery',
    },
    module: {
      rules: [
        {
          test: require.resolve('jquery'),
          use: [
            {
              loader: 'expose-loader',
              options: 'jQuery',
            },
            {
              loader: 'expose-loader',
              options: '$',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          exclude: '/node_modules/',
          loader: 'url-loader?limit=100000',
        },
        {
          test: /\.jsx?$/,
          enforce: 'pre',
          loader: 'jshint-loader',
          exclude: '/node_modules/',
          include: destDir,
        },
        {
          test: /\.jsx?/,
          include: sourceDir,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env'],
          },
        },
      ],
    },
  }

  if (inDevelopment) {
    const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    settings.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        notify: false,
        port: 3000,
        files: ['./scss/*.scss', './pages/*.html'],
        proxy: 'localhost/canopy3/',
      })
    )
    settings.devtool = 'inline-source-map'
  }

  if (inProduction) {
    settings.plugins.push(
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /css\/bootstrap\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
        },
        canPrint: true,
      })
    )
  }
  return settings
}

/* global module, __dirname */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const sourceDir = path.resolve(__dirname, 'js')
const destDir = path.resolve(__dirname, 'dist')
const sourceSassDir = path.resolve(__dirname, 'scss')

module.exports = (env, argv) => {
  const inProduction = argv.mode === 'production'
  const inDevelopment = argv.mode === 'development'

  const settings = {
    entry: {
      'js/bootstrap.js': sourceDir + '/bootstrap.js',
      'css/bootstrap': sourceSassDir + '/bootstrap.scss',
    },
    output: {
      path: destDir,
      filename: '[name]',
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.s?css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}},
          ],
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
    settings.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  }
  return settings
}

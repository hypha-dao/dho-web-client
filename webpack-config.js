const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (cfg) => {
  // cfg.devtool = 'source-map'
  cfg.module.rules.push({
    test: /\.mjs$/,
    type: 'javascript/auto'
  })

  cfg.plugins.push(new CopyWebpackPlugin({
    patterns: [{ from: './public/*.json', to: './', force: true, flatten: true }]
  }))

  cfg.optimization = {
    minimize: true,
    nodeEnv: 'production',

    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }

  cfg.module.rules.push({
    enforce: 'pre',
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/,
    options: {
      formatter: require('eslint').CLIEngine.getFormatter('stylish')
    }
  })

  cfg.module.rules.push({
    test: /\.pug$/,
    loader: 'pug-plain-loader'
  })

  cfg.module.rules.push({
    test: /\.graphql$/,
    use: 'raw-loader'
  })

  cfg.module.rules.push({
    test: /\.gql$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
  })

  cfg.resolve.alias = {
    ...cfg.resolve.alias,
    '~': path.resolve(__dirname, 'src')
  }

  return cfg
}

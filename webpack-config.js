const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (cfg) => {
  cfg.devtool = 'source-map'
  cfg.module.rules.push({
    test: /\.mjs$/,
    type: 'javascript/auto'
  })

  cfg.plugins.push(new CopyWebpackPlugin({
    patterns: [{ from: './public/*.json', to: './', force: true, flatten: true }]
  }))

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

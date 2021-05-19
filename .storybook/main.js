const webpack = require('../webpack-config.js')

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],

  webpackFinal: cfg => {
    cfg = webpack(cfg)

    // Add stylus loading
    cfg.module.rules.push({
      test: /\.(styl|stylus)$/,
      loader: ['style-loader', 'css-loader', 'stylus-loader']
    })

    return cfg
  }
}

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

// Read environment variables from .env
require('dotenv').config()

module.exports = function (ctx) {
  return {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      }
    },

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'axios',
      { path: 'api', server: false },
      { path: 'ual', server: false },
      { path: 'dgraph', server: false },
      { path: 'config', server: false },
      { path: 'ppp', server: false },
      { path: 'croppa', server: false },
      { path: 'sentry', server: false },
      { path: 'light-wallet', server: false }
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'fontawesome-v5'
    ],

    framework: {
      iconSet: 'fontawesome-v5',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!
      importStrategy: 'auto',

      directives: [
        'ClosePopup',
        'Ripple'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'LocalStorage'
      ],
      config: {
        notify: { /* Notify defaults */ }
      }
    },

    build: {
      env: {
        APP_NAME: process.env.APP_NAME,
        DGRAPH_URL: process.env.DGRAPH_URL,
        DGRAPH_ROOT_HASH: process.env.DGRAPH_ROOT_HASH,
        REGISTER_API_URL: process.env.REGISTER_API_URL,
        REGISTER_API_KEY: process.env.REGISTER_API_KEY,
        ACCOUNT_API_URL: process.env.ACCOUNT_API_URL,
        ACCOUNT_API_KEY: process.env.ACCOUNT_API_KEY,
        NETWORK_CHAIN_ID: process.env.NETWORK_CHAIN_ID,
        TELOS_ENDPOINTS: process.env.TELOS_ENDPOINTS,
        TLOSTO_SEEDS: process.env.TLOSTO_SEEDS,
        DAO_CONTRACT: process.env.DAO_CONTRACT,
        BLOCKCHAIN_EXPLORER: process.env.BLOCKCHAIN_EXPLORER,
        BLOCKCHAIN_EXPLORER_BTC: process.env.BLOCKCHAIN_EXPLORER_BTC,
        BLOCKCHAIN_EXPLORER_ETH: process.env.BLOCKCHAIN_EXPLORER_ETH,
        BLOCKCHAIN_EXPLORER_EOS: process.env.BLOCKCHAIN_EXPLORER_EOS,
        PPP_ENV: process.env.PPP_ENV,
        SENTRY_DSN: process.env.SENTRY_DSN,
        DOCUMENTATION: process.env.DOCUMENTATION
      },
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
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

        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '~': path.resolve(__dirname, 'src')
        }
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [
      'fadeIn',
      'fadeOut',
      'slideInRight',
      'slideOutRight'
    ],

    // We use pwa only for the service worker
    // The service worker is what notifies users of new versions/to refresh
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/favicon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          }
        ]
      }
    },

    // Unsupported modes
    ssr: {
      pwa: false
    },
    cordova: {},
    electron: {}
  }
}

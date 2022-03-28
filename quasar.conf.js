// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const path = require('path')
const extendWebpack = require('./webpack-config.js')

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
      'mixins',
      { path: 'api', server: false },
      { path: 'ual', server: false },
      { path: 'dgraph', server: false },
      { path: 'config', server: false },
      { path: 'ppp', server: false },
      { path: 'croppa', server: false },
      { path: 'sentry', server: false },
      { path: 'light-wallet', server: false },
      { path: 'matomo', server: false },
      { path: 'event-buss', server: false }
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
        'Meta',
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
        DOCUMENTATION: process.env.DOCUMENTATION,
        IPFS_URL: process.env.IPFS_URL,
        IPFS_PROJECT_ID: process.env.IPFS_PROJECT_ID,
        IPFS_PROJECT_SECRET: process.env.IPFS_PROJECT_SECRET,
        GRAPHQL_URI: process.env.GRAPHQL_URI,
        SUPPLY_CONTRACT: process.env.SUPPLY_CONTRACT,
        ELASTIC_SEARCH_URL: process.env.ELASTIC_SEARCH_URL,
        ELASTIC_SEARCH_API_KEY: process.env.ELASTIC_SEARCH_API_KEY
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack,
      chainWebpack (chain) {
        chain.module.rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
          .tap(options => {
            options.transpileOptions = {
              transforms: {
                dangerousTaggedTemplateString: true
              }
            }
            return options
          })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    animations: 'all', // --- includes all animations
    // animations: [
    //   'fadeIn',
    //   'fadeOut',
    //   'slideInRight',
    //   'slideOutRight'
    // ],

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
            src: 'statics/icons/favicon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
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

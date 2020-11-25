// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
require('dotenv').config()
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

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
      { path: 'mixins', server: false },
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
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
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
        REGISTER_API_URL: process.env.REGISTER_API_URL,
        REGISTER_API_KEY: process.env.REGISTER_API_KEY,
        ACCOUNT_API_URL: process.env.ACCOUNT_API_URL,
        ACCOUNT_API_KEY: process.env.ACCOUNT_API_KEY,
        NETWORK_CHAIN_ID: process.env.NETWORK_CHAIN_ID,
        TELOS_ENDPOINTS: process.env.TELOS_ENDPOINTS,
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

    ssr: {
      pwa: false
    },

    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        // name: 'HyphaDAC Mobile Dapp',
        // short_name: 'HyphaDAC Mobile Dapp',
        // description: 'HyphaDAC Mobile Dapp',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'hyphadac-quasar'
      }
    }
  }
}

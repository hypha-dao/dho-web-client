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
      { path: 'ual', server: false },
      { path: 'api', server: false },
      { path: 'config', server: false },
      { path: 'ppp', server: false },
      { path: 'croppa', server: false },
      { path: 'qmarkdown', server: false },
      { path: 'sentry', server: false }
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

      components: [
        'QAvatar',
        'QBadge',
        'QBanner',
        'QBtn',
        'QBtnDropdown',
        'QBtnGroup',
        'QCard',
        'QCardActions',
        'QCardSection',
        'QCheckbox',
        'QChip',
        'QDate',
        'QDialog',
        'QDrawer',
        'QExpansionItem',
        'QField',
        'QFooter',
        'QForm',
        'QHeader',
        'QIcon',
        'QInput',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QImg',
        'QInfiniteScroll',
        'QInnerLoading',
        'QKnob',
        'QLayout',
        'QList',
        'QMenu',
        'QPage',
        'QPageContainer',
        'QPageSticky',
        'QPopupProxy',
        'QRouteTab',
        'QScrollArea',
        'QSelect',
        'QSeparator',
        'QSpinner',
        'QSpinnerDots',
        'QSplitter',
        'QStep',
        'QStepper',
        'QStepperNavigation',
        'QTable',
        'QTab',
        'QTabPanel',
        'QTabPanels',
        'QTabs',
        'QTimeline',
        'QTimelineEntry',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip'
      ],

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

    supportIE: false,

    build: {
      env: {
        APP_NAME: process.env.APP_NAME,
        REGISTER_API_URL: process.env.REGISTER_API_URL,
        REGISTER_API_KEY: process.env.REGISTER_API_KEY,
        ACCOUNT_API_URL: process.env.ACCOUNT_API_URL,
        ACCOUNT_API_KEY: process.env.ACCOUNT_API_KEY,
        NETWORK_HOST: process.env.NETWORK_HOST,
        NETWORK_PROTOCOL: process.env.NETWORK_PROTOCOL,
        NETWORK_PORT: process.env.NETWORK_PORT,
        DAO_CONTRACT: process.env.DAO_CONTRACT,
        BLOCKCHAIN_EXPLORER: process.env.BLOCKCHAIN_EXPLORER,
        PPP_ENV: process.env.PPP_ENV,
        SENTRY_DSN: process.env.SENTRY_DSN
      },
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          test: /\.mjs$/,
          type: 'javascript/auto'
        })

        cfg.plugins.push(new CopyWebpackPlugin(
          [{ from: './src/statics/*.json', to: './', force: true, flatten: true }],
          { copyUnmodified: true }
        ))

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
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
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

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const fs = require('fs')
const path = require('path')

const packageJson = fs.readFileSync('./package.json')
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
      'i18n',
      { path: 'api', server: false },
      { path: 'directives', server: false },
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

    css: ['app.styl'],

    extras: ['fontawesome-v5'],

    framework: {
      iconSet: 'fontawesome-v5',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!
      importStrategy: 'auto',

      directives: ['ClosePopup', 'Ripple'],

      // Quasar plugins
      plugins: ['Meta', 'Notify'],
      config: {
        notify: {
          /* Notify defaults */
        }
      }
    },

    build: {
      env: {
        APP_NAME: process.env.APP_NAME,
        ENV: process.env.ENV,
        DGRAPH_URL: process.env.DGRAPH_URL,
        DGRAPH_ROOT_HASH: process.env.DGRAPH_ROOT_HASH,
        DGRAPH_AUTH_KEY: process.env.DGRAPH_AUTH_KEY,
        ROOT_DAO_ID: process.env.ROOT_DAO_ID,
        ROOT_DAO_SLUG: process.env.ROOT_DAO_SLUG,
        REGISTER_API_URL: process.env.REGISTER_API_URL,
        REGISTER_API_KEY: process.env.REGISTER_API_KEY,
        ACCOUNT_API_URL: process.env.ACCOUNT_API_URL,
        ACCOUNT_API_KEY: process.env.ACCOUNT_API_KEY,
        NETWORK_CHAIN_ID: process.env.NETWORK_CHAIN_ID,
        BLOCKCHAIN_ENDPOINTS: process.env.BLOCKCHAIN_ENDPOINTS,
        TLOSTO_SEEDS: process.env.TLOSTO_SEEDS,
        DAO_CONTRACT: process.env.DAO_CONTRACT,
        KV_CONTRACT: process.env.KV_CONTRACT,
        BLOCKCHAIN_EXPLORER: process.env.BLOCKCHAIN_EXPLORER,
        BLOCKCHAIN_EXPLORER_BTC: process.env.BLOCKCHAIN_EXPLORER_BTC,
        BLOCKCHAIN_EXPLORER_ETH: process.env.BLOCKCHAIN_EXPLORER_ETH,
        BLOCKCHAIN_EXPLORER_EOS: process.env.BLOCKCHAIN_EXPLORER_EOS,
        PPP_ENV: process.env.PPP_ENV,
        PPP_APP_ID: process.env.PPP_APP_ID,
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ENV: process.env.SENTRY_ENV,
        IPFS_URL: process.env.IPFS_URL,
        IPFS_PROJECT_ID: process.env.IPFS_PROJECT_ID,
        IPFS_PROJECT_SECRET: process.env.IPFS_PROJECT_SECRET,
        IPFS_GATEWAY: process.env.IPFS_GATEWAY,
        GRAPHQL_URI: process.env.GRAPHQL_URI,
        SUPPLY_CONTRACT: process.env.SUPPLY_CONTRACT,
        DECIDE_CONTRACT: process.env.DECIDE_CONTRACT,
        SEEDS_TOKEN_CONTRACT: process.env.SEEDS_TOKEN_CONTRACT,
        SEEDS_ESCROW_CONTRACT: process.env.SEEDS_ESCROW_CONTRACT,
        HVOICE_TOKEN_CONTRACT: process.env.HVOICE_TOKEN_CONTRACT,
        HYPHA_CONTRACT: process.env.HYPHA_CONTRACT,
        ELASTIC_SEARCH_URL: process.env.ELASTIC_SEARCH_URL,
        ELASTIC_SEARCH_API_KEY: process.env.ELASTIC_SEARCH_API_KEY,
        MULTISIG_CONTRACT: process.env.MULTISIG_CONTRACT,
        HYPHA_TOKEN_SALES_ENCODE_KEY: process.env.HYPHA_TOKEN_SALES_ENCODE_KEY,
        HYPHA_TOKEN_SALES_URL: process.env.HYPHA_TOKEN_SALES_URL,
        HYPHA_TOKEN_SALES_API_URL: process.env.HYPHA_TOKEN_SALES_API_URL,
        HYPHA_TOKEN_SALES_RPC_URL: process.env.HYPHA_TOKEN_SALES_RPC_URL,
        PACKAGE_VERSION: JSON.parse(packageJson).version || 0,
        HEALTH_ENDPOINT: process.env.HEALTH_ENDPOINT,
        CHAIN_NAME: process.env.CHAIN_NAME || 'telos',
        IS_TESTNET: process.env.IS_TESTNET,
        HYPHA_AUTH_URL:
          process.env.HYPHA_AUTH_URL ||
          'https://y3b2ihsdv7.execute-api.us-east-1.amazonaws.com',
        CAPTCHA_PUBLIC_KEY: process.env.CAPTCHA_PUBLIC_KEY,
        CAPTCHA_HOST: process.env.CAPTCHA_HOST,
        CAPTCHA_NETWORK: process.env.CAPTCHA_NETWORK || 'telosTestnet',
        ENABLE_CAPTCHA: process.env.ENABLE_CAPTCHA !== undefined ? process.env.ENABLE_CAPTCHA === 'true' : true,
        LOGIN_CONTRACT: process.env.LOGIN_CONTRACT,
        JOIN_CONTRACT: process.env.JOIN_CONTRACT,
        JOIN_URI: process.env.JOIN_URI,
        DEFFERED_HYPHA_CONTRACT: process.env.DEFFERED_HYPHA_CONTRACT || 'costak.hypha',
        DOWNLOAD_WALLET_LINK_IOS:
          process.env.DOWNLOAD_WALLET_LINK_IOS ||
          'http://itunes.apple.com/lb/app/1659926348',
        DOWNLOAD_WALLET_LINK_ANDROID:
          process.env.DOWNLOAD_WALLET_LINK_ANDROID ||
          'http://play.google.com/store/apps/details?id=earth.hypha.wallet.hypha_wallet'
      },

      scopeHoisting: true,
      vueRouterMode: 'history',
      // showProgress: true,
      gzip: true,
      // analyze: true,
      distDir: 'dist/spa',
      // productName: 'pos_host_ui',
      minify: true,
      vueCompiler: false,
      extractCSS: true,
      supportTS: {
        tsCheckerConfig: {
          eslint: true
        }
      },
      extendWebpack,
      chainWebpack(chain) {
        chain.module
          .rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
          .tap((options) => {
            options.transpileOptions = {
              transforms: {
                dangerousTaggedTemplateString: true
              }
            }
            return options
          })
      },
      uglifyOptions: {
        minimize: true,
        compress: {
          warnings: false, // warn about potentially dangerous optimizations/code
          sequences: true, // join consecutive statemets with the “comma operator”
          properties: true, // optimize property access: a["foo"] → a.foo
          dead_code: true, // discard unreachable code
          drop_debugger: true, // discard “debugger” statements
          unsafe: true, // some unsafe optimizations (see below)
          conditionals: true, // optimize if-s and conditional expressions
          comparisons: true, // optimize comparisons
          evaluate: true, // evaluate constant expressions
          booleans: true, // optimize boolean expressions
          loops: true, // optimize loops
          unused: true, // drop unused variables/functions
          hoist_funs: true, // hoist function declarations
          hoist_vars: true, // hoist variable declarations
          if_return: true, // optimize if-s followed by return/continue
          join_vars: true, // join var declarations
          // cascade: true, // try to cascade `right` into `left` in sequences
          side_effects: true // drop side-effect-free statements
        }
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

    // Unsupported modes
    ssr: {
      pwa: false
    },
    cordova: {},
    electron: {},
    pwa: {}
  }
}

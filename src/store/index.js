import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import wallet from './modules/wallet'
import roles from './modules/roles'
import assignments from './modules/assignments'
import payouts from './modules/payouts'
import members from './modules/members'
import feeds from './modules/feeds'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wallet,
    roles,
    assignments,
    payouts,
    members,
    feeds
  },
  strict: process.env.DEV
})

Vue.config.devtools = true

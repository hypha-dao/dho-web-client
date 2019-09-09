import Vue from 'vue'
import Vuex from 'vuex'

import assignments from './assignments'
import feeds from './feeds'
import members from './members'
import payouts from './payouts'
import profile from './profile'
import roles from './roles'
import wallet from './wallet'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wallet,
    roles,
    assignments,
    payouts,
    profile,
    members,
    feeds
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

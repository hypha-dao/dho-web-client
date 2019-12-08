import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import assignments from './assignments'
import notifications from './notifications'
import payouts from './payouts'
import periods from './periods'
import profile from './profile'
import roles from './roles'
import trail from './trail'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accounts,
    assignments,
    notifications,
    payouts,
    periods,
    profile,
    roles,
    trail
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

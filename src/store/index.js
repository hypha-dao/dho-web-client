import Vue from 'vue'
import Vuex from 'vuex'

// Used by v1 client
import layout from './layout'
import multiSig from './multi-sig'
import notifications from './notifications'
import payments from './payments'
import payouts from './payouts'
import periods from './periods'
import trail from './trail'
import treasury from './treasury'

// Used by multi-dao client
import assignments from './assignments'
import profiles from './profiles'
import accounts from './accounts'
import ballots from './ballots'
import dao from './dao'
import proposals from './proposals'
import search from './search'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    ballots,
    layout,
    notifications,
    payments,
    payouts,
    periods,
    trail,
    treasury,
    multiSig,

    // Multi-dao
    assignments,
    profiles,
    accounts,
    dao,
    proposals,
    search
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

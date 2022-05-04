import Vue from 'vue'
import Vuex from 'vuex'

// Used by v1 client
import assignments from './assignments'
import documentsProposal from './documents-proposal'
import layout from './layout'
import multiSig from './multi-sig'
import notifications from './notifications'
import objects from './objects'
import payments from './payments'
import payouts from './payouts'
import periods from './periods'
import roles from './roles'
import trail from './trail'
import treasury from './treasury'

// Used by multi-dao client
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
    assignments,
    ballots,
    documentsProposal,
    layout,
    notifications,
    objects,
    payments,
    payouts,
    periods,
    roles,
    trail,
    treasury,
    multiSig,

    // Multi-dao
    profiles,
    accounts,
    dao,
    proposals,
    search
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

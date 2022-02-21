import Vue from 'vue'
import Vuex from 'vuex'

// Used by v1 client
import applicants from './applicants'
import assignments from './assignments'
import badges from './badges'
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
import members from './members'
import profiles from './profiles'
import accounts from './accounts'
import ballots from './ballots'
import dao from './dao'
import proposals from './proposals'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    applicants,
    assignments,
    badges,
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
    members,
    profiles,
    accounts,
    dao,
    proposals
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

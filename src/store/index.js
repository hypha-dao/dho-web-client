import Vue from 'vue'
import Vuex from 'vuex'

// Used by v1 client
import applicants from './applicants'
import assignments from './assignments'
import badges from './badges'
import documentsProposal from './documents-proposal'
import layout from './layout'
import members from './members'
import multiSig from './multi-sig'
import notifications from './notifications'
import objects from './objects'
import payments from './payments'
import payouts from './payouts'
import periods from './periods'
import profiles from './profiles'
import roles from './roles'
import trail from './trail'
import treasury from './treasury'

// Used by multi-dao client
import accounts from './accounts'
import ballots from './ballots'
import dao from './dao'
import proposals from './proposals'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    accounts,
    applicants,
    assignments,
    badges,
    ballots,
    documentsProposal,
    layout,
    members,
    notifications,
    objects,
    payments,
    payouts,
    periods,
    profiles,
    roles,
    trail,
    treasury,
    multiSig,

    // Multi-dao
    dao,
    proposals
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

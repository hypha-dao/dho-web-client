import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import applicants from './applicants'
import assignments from './assignments'
import badges from './badges'
import ballots from './ballots'
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

Vue.use(Vuex)

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
    multiSig
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

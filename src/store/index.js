import Vue from 'vue'
import Vuex from 'vuex'

import accounts from './accounts'
import applicants from './applicants'
import assignments from './assignments'
import layout from './layout'
import members from './members'
import notifications from './notifications'
import payments from './payments'
import payouts from './payouts'
import periods from './periods'
import profiles from './profiles'
import proposals from './proposals'
import roles from './roles'
import trail from './trail'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    accounts,
    applicants,
    assignments,
    layout,
    members,
    notifications,
    payments,
    payouts,
    periods,
    profiles,
    proposals,
    roles,
    trail
  },
  strict: process.env.NODE_ENV !== 'production'
})

Vue.config.devtools = true

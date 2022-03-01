import state from './state'
import * as mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

export default {
  namespaced: true,
  state: {
    isConnected: false,
    isTransactionSending: false,
    lastTransactionHash: ''
  },
  actions: {
    login: ({ commit }) => {
      commit('login')
    },
    logout: ({ commit }) => {
      commit('logout')
    },
    startTransaction: ({ commit }) => {
      commit('startTransaction')
    },
    finishTransaction: ({ commit }, payload) => {
      commit('finishTransaction', payload)
    }
  },
  mutations: {
    login: (state) => {
      state.isConnected = true
    },
    logout: (state) => {
      state.isConnected = false
    },
    startTransaction: (state) => {
      state.isTransactionSending = true
    },
    finishTransaction: (state, payload) => {
      console.log('finishTransaction', payload)
      state.isTransactionSending = false
      state.lastTransactionHash = payload
    }
  }
}

export default {
  namespaced: true,
  state: {
    isConnected: false,
    isTransactionSending: false,
    lastTransactionHash: '',
    lastTransactionMessage: ''
  },
  actions: {
    login: ({ commit }) => {
      commit('login')
    },
    logout: ({ commit }) => {
      commit('logout')
    },
    startTransaction: ({ commit }, payload) => {
      commit('startTransaction', payload)
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
    startTransaction: (state, payload) => {
      state.isTransactionSending = true
      state.lastTransactionMessage = payload
    },
    finishTransaction: (state, payload) => {
      console.log('finishTransaction', payload)
      state.isTransactionSending = false
      state.lastTransactionHash = payload
    }
  }
}

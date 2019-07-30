import wallet from 'src/wallet'

export default {
  namespaced: true,
  state: {
    isConnected: false,
    isTransactionSending: false,
    lastTransactionHash: '',
    lastTransactionName: '',
    lastTransactionError: ''
  },
  actions: {
    login: ({ dispatch, commit }) => {
      const accountName = wallet.getUserAccount()

      dispatch('feeds/loadUser', { accountName })

      commit('login')
    },
    logout: ({ dispatch, commit }) => {
      dispatch('feeds/resetUser', {})

      commit('logout')
    },
    sendTransaction: async ({ commit }, payload) => {
      commit('startTransaction', payload.name)
      try {
        const result = await wallet.transact(payload.transaction)
        commit('finishTransaction', result.transaction_id)
      } catch (err) {
        commit('catchTransaction', err)
      }
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
      state.isTransactionSending = false
      state.lastTransactionHash = payload
    },
    catchTransaction: (state, payload) => {
      state.isTransactionSending = false
      state.lastTransactionError = payload
    }
  }
}

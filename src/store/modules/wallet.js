import wallet from 'src/wallet'

export default {
  namespaced: true,
  state: {
    accountName: null,
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

      commit('login', accountName)
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
    login: (state, payload) => {
      state.isConnected = true
      state.accountName = payload.accountName
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

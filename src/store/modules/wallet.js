import wallet from 'src/wallet'

export default {
  namespaced: true,
  state: {
    accountName: null,
    isConnected: false,
    isTransactionSending: false,
    lastTransactionHash: '',
    lastTransactionName: '',
    lastTransactionError: '',
    lastCatchedError: ''
  },
  actions: {
    register: async ({ dispatch, commit }, payload) => {
      const { accountName, privateKey, publicKey } = payload

      try {
        await wallet.createAccount({ accountName, publicKey })

        localStorage.setItem('accountName', accountName)
        localStorage.setItem('privateKey', privateKey)

        await wallet.init({ privateKey, accountName })

        dispatch('feeds/loadUser', { accountName }, { root: true })

        commit('login', { accountName })
      } catch (err) {
        commit('catchError', err)
      }
    },
    connect: async ({ dispatch, commit }, payload) => {
      const { privateKey, accountName } = payload

      try {
        await wallet.init({ privateKey, accountName })

        if (accountName) {
          dispatch('feeds/loadUser', { accountName }, { root: true })
          commit('login', { accountName })
        }

        commit('connect')
      } catch (err) {
        commit('catchError', err)
      }
    },
    login: async ({ dispatch, commit }, payload) => {
      const { accountName, privateKey } = payload

      localStorage.setItem('accountName', accountName)
      localStorage.setItem('privateKey', privateKey)

      await wallet.init({ accountName, privateKey })

      dispatch('feeds/loadUser', { accountName }, { root: true })

      commit('connect')
      commit('login', { accountName })
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
    connect: (state, payload) => {
      state.isConnected = true
    },
    login: (state, payload) => {
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
    },
    catchError: (state, payload) => {
      state.lastCatchedError = payload
    }
  }
}

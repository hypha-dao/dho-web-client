import wallet from 'src/wallet'
import { LocalStorage } from 'quasar'

export default {
  namespaced: true,
  state: {
    accountName: null,
    isConnected: false,
    isTransactionSending: false,
    lastTransactionHash: '',
    lastTransactionMessage: '',
    lastTransactionError: '',
    lastCatchedError: ''
  },
  actions: {
    createWallet: async ({ dispatch, commit }, payload) => {
      const { accountName, privateKey, publicKey, inviteCode } = payload

      try {
        commit('startTransaction', 'Register account')

        const transactionId = await wallet.createAccount({ accountName, publicKey, inviteCode })

        if (transactionId) {
          commit('finishTransaction', transactionId)

          LocalStorage.set('accountName', accountName)
          LocalStorage.set('privateKey', privateKey)

          await wallet.init({ privateKey, accountName })

          dispatch('feeds/loadUser', { accountName }, { root: true })

          commit('login', { accountName })
        } else {
          commit('catchTransaction', `Cannot register account ${accountName}`)
        }
      } catch (err) {
        commit('catchError', err)
      }
    },
    openWallet: async ({ dispatch, commit }, payload) => {
      const { accountName, privateKey } = payload

      LocalStorage.set('accountName', accountName)
      LocalStorage.set('privateKey', privateKey)

      try {
        await wallet.init({ accountName, privateKey })

        dispatch('feeds/loadUser', { accountName }, { root: true })

        commit('connect')
        commit('login', { accountName })
      } catch (err) {
        commit('catchError', err)
      }
    },
    closeWallet: async ({ dispatch, commit }, payload) => {
      LocalStorage.remove('accountName')
      LocalStorage.remove('privateKey')

      commit('disconnect')
      commit('logout')
    },
    connectWallet: async ({ dispatch, commit }, payload) => {
      const privateKey = (payload && payload.privateKey) || null
      const accountName = (payload && payload.accountName) || null

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
    becomeMember: async ({ dispatch, commit }, payload) => {
      commit('startTransaction', 'Become Member')

      try {
        const { inviteCode } = payload
        const transactionId = await wallet.becomeMember({ inviteCode })

        commit('finishTransaction', transactionId)
      } catch (err) {
        commit('catchTransaction', err)
      }
    },
    sendTransaction: async ({ commit }, payload) => {
      commit('startTransaction', payload.name)
      try {
        const result = await wallet.transact(payload.transaction)
        commit('finishTransaction', result.transaction_id)
      } catch (err) {
        commit('catchTransaction', err)
      }
    },
    sendVote: ({ dispatch }, payload) => {
      const { ballots, direction } = payload

      const trail = wallet.getTrailAccount()
      const user = wallet.getUserAccount()

      let transaction = {
        actions: ballots.map(ballotId => {
          return {
            account: trail,
            name: 'castvote',
            authorization: [{
              actor: user,
              permission: 'active'
            }],
            data: {
              voter: user,
              ballot_id: ballotId,
              direction: direction
            }
          }
        })
      }

      console.log({ transaction })

      dispatch('wallet/sendTransaction', {
        name: 'Send Votes',
        transaction
      }, { root: true })
    }
  },
  mutations: {
    connect: (state, payload) => {
      state.isConnected = true
    },
    disconnect: (state, payload) => {
      state.isConnected = false
    },
    login: (state, payload) => {
      state.accountName = payload.accountName
    },
    logout: (state, payload) => {
      state.accountName = null
    },
    startTransaction: (state, payload) => {
      state.isTransactionSending = true
      state.lastTransactionMessage = payload
      state.lastTransactionHash = ''
      state.lastTransactionError = ''
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

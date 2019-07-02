import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    state: {
      wallet: null,
      sending: false,
      lastResult: null,
      roles: null
    },
    getters: {
      getSending: state => {
        return state.sending
      },
      getLastResult: state => {
        return state.lastResult
      },
      getWallet: state => {
        return state.wallet
      },
      getRoles: state => {
        return state.roles
      }
    },
    mutations: {
      setWallet (state, payload) {
        state.wallet = payload.wallet
      },
      setSending (state, payload) {
        state.sending = payload.sending
      },
      setLastResult (state, payload) {
        state.lastResult = payload.lastResult
      },
      setRoles (state, payload) {
        state.roles = payload.roles
      }
    },
    actions: {
      setWallet (context, payload) {
        context.commit('setWallet', payload)
      },
      async init ({ commit, state }) {
        await state.wallet.eosApi.rpc.get_table_rows({
          json: true,
          code: 'hyphadactest',
          scope: 'hyphadactest',
          table: 'roles'
        }).then(result => {
          commit('setRoles', { roles: result.rows })
        })
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}

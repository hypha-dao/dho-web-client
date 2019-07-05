// import wallet from '../../wallet/'

export default {
  namespaced: true,
  state: {
    isConnected: false
  },
  getters: {
  },
  actions: {
    login: ({ commit }) => {
      commit('login')
    },
    logout: ({ commit }) => {
      commit('logout')
    }
  },
  mutations: {
    login: (state) => {
      state.isConnected = true
    },
    logout: (state) => {
      state.isConnected = false
    }
  }
}

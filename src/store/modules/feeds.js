import stream from 'getstream'

const client = stream.connect('skkd3tdbsjfk', null, 55737)
const activitiesFeed = client.feed('default', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImRlZmF1bHRjb21tb24ifQ.hDV8-S8JrQnoHgbiAaNoK_ZfP9C1MhLDQqz85rdDRDs')

console.log({ token: activitiesFeed.token })

export default {
  namespaced: true,
  state: {
    activities: {},
    user: {}
  },
  actions: {
    loadActivities: async ({ commit }, payload) => {
      const { results } = await activitiesFeed.get({
        reactions: { recent: true, counts: true, own: true }
      })

      commit('setActivities', results)
    },
    loadUser: async ({ commit }, payload) => {
      const { accountName } = payload

      const user = await client.user(accountName).get()

      commit('setUser', user)
    },
    resetUser: async ({ commit }, payload) => {
      commit('unsetUser')
    }
  },
  mutations: {
    setActivities: (state, results) => {
      state.activities = results
    },
    setUser: (state, user) => {
      state.user = user
    },
    unsetUser: (state) => {
      state.user = {}
    }
  }
}

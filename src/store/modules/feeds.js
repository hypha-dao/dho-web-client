import stream from 'getstream'

const client = stream.connect('skkd3tdbsjfk', null, 55737)
const activitiesFeed = client.feed('default', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6ImRlZmF1bHRjb21tb24ifQ.hDV8-S8JrQnoHgbiAaNoK_ZfP9C1MhLDQqz85rdDRDs')
const usersFeed = client.feed('users', 'common', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiIqIiwiZmVlZF9pZCI6InVzZXJzY29tbW9uIn0.oOxpjZGycivRIMP20oO3lJhJK7EsYVqZ4In2u6J4Pag')

export default {
  namespaced: true,
  state: {
    activities: {},
    user: {},
    users: [],
    avatarResult: null
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
    },
    loadUsers: async ({ commit }, payload) => {
      const { results } = await usersFeed.get({ enrich: true })

      const users = results.map(result => result.actor.data)

      commit('setUsers', users)
    },
    uploadAvatar: async ({ commit }, payload) => {
      const { file } = payload

      const result = await client.images.upload(file)

      commit('setAvatarResult', result)
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
    },
    setUsers: (state, users) => {
      state.users = users
    },
    setAvatarResult: (state, result) => {
      state.avatarResult = result
    }
  }
}

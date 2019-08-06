import stream from 'src/stream'

export default {
  namespaced: true,
  state: {
    activities: {},
    user: {},
    users: [],
    members: [],
    roles: [],
    avatarResult: null
  },
  actions: {
    loadActivities: async ({ commit }, payload) => {
      const { results } = await stream.getActivities()

      commit('setActivities', results)
    },
    loadUser: async ({ commit }, payload) => {
      const { accountName } = payload

      const user = await stream.getUser(accountName)

      commit('setUser', user.data)
    },
    resetUser: async ({ commit }, payload) => {
      commit('unsetUser')
    },
    loadMembers: async ({ commit }, payload) => {
      const { results } = await stream.getUsers()

      const users = results.map(result => ({
        ...result.actor.data,
        assignments: result.latest_reactions.assignment
      }))

      console.log({ users })

      commit('setMembers', users)
    },
    loadRoles: async ({ commit }, payload) => {
      const { results } = await stream.getRoles()

      const roles = results.map(result => ({
        ...result,
        assignments: result.latest_reactions.assignment
      }))

      commit('setRoles', roles)
    },
    uploadAvatar: async ({ commit }, payload) => {
      const { file } = payload

      const result = await stream.uploadAvatar(file)

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
    setMembers: (state, members) => {
      state.members = members
    },
    setRoles: (state, roles) => {
      state.roles = roles
    },
    setAvatarResult: (state, result) => {
      state.avatarResult = result
    }
  }
}

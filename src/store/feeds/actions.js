import stream from 'src/stream'

export const loadActivities = async ({ commit }, payload) => {
  const { results } = await stream.getActivities()

  commit('setActivities', results)
}

export const updateProfile = async ({ commit }, payload) => {
  const user = await stream.updateUser(payload)

  commit('setUser', user)
}

export const loadUser = async ({ commit }, payload) => {
  const { accountName } = payload

  const user = await stream.getUser(accountName)

  commit('setUser', user)
}

export const resetUser = async ({ commit }, payload) => {
  commit('unsetUser')
}

export const loadMembers = async ({ commit }, payload) => {
  const { results } = await stream.getUsers()

  const users = results.map(result => ({
    ...result.actor.data,
    assignments: result.latest_reactions.assignment
  }))

  commit('setMembers', users)
}

export const loadRoles = async ({ commit }, payload) => {
  const { results } = await stream.getRoles()

  const roles = results.map(result => ({
    ...result,
    assignments: result.latest_reactions.assignment
  }))

  commit('setRoles', roles)
}

export const uploadAvatar = async ({ commit }, payload) => {
  const { file } = payload

  const result = await stream.uploadAvatar(file)

  commit('setAvatarResult', result)
}

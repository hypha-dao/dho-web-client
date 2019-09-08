export const setActivities = (state, results) => {
  state.activities = results
}

export const setUser = (state, user) => {
  state.user = {
    ...user.data,
    accountName: user.id
  }
}

export const unsetUser = (state) => {
  state.user = {}
}

export const setMembers = (state, members) => {
  state.members = members
}

export const setRoles = (state, roles) => {
  state.roles = roles
}

export const setAvatarResult = (state, result) => {
  state.avatarResult = result
}

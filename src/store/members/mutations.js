export const setRegistered = (state, registered) => {
  state.registered = registered
}

export const clearMembers = (state) => {
  state.members = []
}

export const addMembers = (state, members) => {
  state.members = [...state.members, ...members]
}

export const setConnected = (state, connected) => {
  state.connected = connected
}

export const addProfile = (state, { profile, username }) => {
  state.profiles[username] = profile
}

export const setLoading = (state, username) => {
  state.loadings[username] = true
}

export const setView = (state, view) => {
  state.view = view
}

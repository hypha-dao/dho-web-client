export const setConnected = (state, connected) => {
  state.connected = connected
}

export const addProfile = (state, { profile, username }) => {
  state.profiles[username] = profile
  state.loadings[username] = false
}

export const setLoading = (state, username) => {
  state.loadings[username] = true
}

export const setView = (state, view) => {
  state.view = view
}

export const setDrafts = (state, drafts) => {
  state.drafts = drafts
}

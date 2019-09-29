export const setProfile = (state, profile) => {
  if (profile) {
    state.profile = profile
  }
}

export const updateProfile = (state, profile) => {
  state.profile = profile
}

export const clearProfile = (state) => {
  state.profile = null
}

export const setProfile = (state, { accountName, profile }) => {
  if (profile) {
    state.profile = profile
  }
  state.accountName = accountName
}

export const updateProfile = (state, profile) => {
  state.profile = profile
}

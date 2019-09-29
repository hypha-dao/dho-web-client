export const setShowLogin = (state, show) => {
  state.showLogin = show
}

export const setShowRegister = (state, show) => {
  state.showRegister = show
}

export const setAuthenticated = (state, accountName) => {
  state.authenticated = true
  state.accountName = accountName
}

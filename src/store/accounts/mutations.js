export const setLoadingWallet = (state, wallet) => {
  state.loading = wallet
}

export const setAccount = function (state, account) {
  state.account = account
}

export const clearAccount = function (state) {
  localStorage.removeItem('autoLogin')
  state.account = null
  this.$router.push({ path: '/' })
}

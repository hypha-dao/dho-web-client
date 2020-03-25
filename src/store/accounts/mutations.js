export const setLoadingWallet = (state, wallet) => {
  state.loading = wallet
}

export const setAccount = (state, account) => {
  state.account = account
}

export const clearAccount = function (state) {
  localStorage.removeItem('autoLogin')
  state.account = null
  state.membership = false
  state.enroller = false
  if (this.$route.path !== '/') {
    this.$router.push({ path: '/' })
  }
}

export const setMembership = (state, membership) => {
  state.membership = membership
}

export const setEnroller = (state, enroller) => {
  state.enroller = enroller
}

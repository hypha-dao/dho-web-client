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
  state.applicant = false
  state.enroller = false
}

export const setMembership = (state, membership) => {
  state.membership = membership
}

export const setApplicant = (state, applicant) => {
  state.applicant = applicant
}

export const setEnroller = (state, enroller) => {
  state.enroller = enroller
}

export const setAdmin = (state, admin) => {
  state.admin = admin
}

export const setIsHyphaOwner = (state, isHyphaOwner) => {
  state.isHyphaOwner = isHyphaOwner
}

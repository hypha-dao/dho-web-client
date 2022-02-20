import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

export const lightWalletLogin = async function ({ commit, dispatch }, { returnUrl }) {
  try {
    const account = await this.$lightWallet.login()
    commit('setAccount', account)
    this.$type = 'lightWallet'
    await dispatch('profiles/getPublicProfile', account, { root: true })
    await dispatch('profiles/getDrafts', account, { root: true })
    if (this.$router.currentRoute.path !== returnUrl) {
      await this.$router.push({ path: returnUrl })
    }
  } catch (e) {
    return `Cannot login with Light Wallet: ${e}`
  }
}

export const loginWallet = async function ({ commit, dispatch }, { idx, returnUrl }) {
  const authenticator = this.$ual.authenticators[idx]
  commit('setLoadingWallet', authenticator.getStyle().text)
  await authenticator.init()
  let error
  let account
  try {
    const users = await authenticator.login()
    if (users.length) {
      account = users[0].accountName
      commit('setAccount', account)
      this.$ualUser = users[0]
      this.$type = 'ual'
      localStorage.setItem('autoLogin', authenticator.ualName)
      this.$ppp.setActiveUser(this.$ualUser)
      await dispatch('profiles/getPublicProfile', account, { root: true })
      await dispatch('profiles/getDrafts', account, { root: true })
    }
    localStorage.setItem('known-user', true)
    if (this.$router.currentRoute.path !== returnUrl) {
      await this.$router.push({ path: returnUrl })
    }
  } catch (e) {
    error = (authenticator.getError() && authenticator.getError().message) || e.message
  }
  commit('setLoadingWallet')
  return error
}

export const loginInApp = async function ({ commit, dispatch }, { account, privateKey, returnUrl }) {
  try {
    const signatureProvider = new JsSignatureProvider([privateKey])
    const rpc = new JsonRpc(this.$apiUrl)
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

    this.$type = 'inApp'
    this.$inAppUser = api
    this.$inAppUser.getAccountName = () => account
    this.$inAppUser.signTransaction = api.transact
    this.$ppp.setActiveUser(this.$inAppUser)
    commit('setAccount', account)
    await dispatch('profiles/getPublicProfile', account, { root: true })
    await dispatch('profiles/getDrafts', account, { root: true })
    localStorage.setItem('known-user', true)
    if (this.$router.currentRoute.path !== returnUrl) {
      await this.$router.push({ path: returnUrl })
    }
  } catch (e) {
    return 'Invalid private key'
  }
}

export const logout = async function ({ commit }) {
  const tmp1 = localStorage.getItem('known-user')
  const tmp2 = localStorage.getItem('drafts')
  localStorage.clear()
  localStorage.setItem('known-user', tmp1)
  localStorage.setItem('drafts', tmp2)
  if (this.$type === 'ual') {
    const wallet = localStorage.getItem('autoLogin')
    const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
    if (idx !== -1) {
      try {
        this.$ual.authenticators[idx].logout()
      } catch (e) {
        // Do nothing, connection lost
      }
    }
  }
  commit('clearAccount')
  this.$ualUser = null
  this.$inAppUser = null
  this.$type = null
  commit('profiles/setConnected', false, { root: true })

  const selectedDao = this.getters['dao/selectedDao']
  const route = `/${selectedDao.name}/login`
  if (this.$router.currentRoute.path !== route) {
    await this.$router.push({ path: route })
  }
}

export const autoLogin = async function ({ dispatch }) {
  if (typeof window.LightWalletChannel === 'object') {
    return !dispatch('lightWalletLogin')
  }

  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.ualName === wallet)
  if (idx !== -1) {
    const authenticator = this.$ual.authenticators[idx]
    await authenticator.init()
    return !dispatch('loginWallet', { idx })
  }
  return false
}

export const isAccountFree = async function (context, accountName) {
  try {
    await this.$api.getAccount(accountName)
    return false
  } catch {}
  return true
}

export const sendOTP = async function ({ commit }, form) {
  const { status, error } = await this.$accountApi.post('/v1/registrations', {
    smsNumber: form.internationalPhone,
    telosAccount: form.account
  })
  return {
    success: status !== 403,
    error: error && error.message
  }
}

export const verifyOTP = async function ({ commit, state }, { smsOtp, smsNumber, telosAccount, publicKey, privateKey, reason }) {
  const { error } = await this.$accountApi.post('/v1/accounts', {
    smsOtp,
    smsNumber,
    telosAccount,
    ownerKey: publicKey,
    activeKey: publicKey
  })
  if (error) {
    return {
      success: false,
      error: error.message
    }
  }
  const signatureProvider = new JsSignatureProvider([privateKey])
  const rpc = new JsonRpc(this.$apiUrl)
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

  this.$type = 'inApp'
  this.$inAppUser = api
  this.$inAppUser.signTransaction = api.transact

  const actions = []

  if (!state.registered) {
    actions.push({
      account: this.$config.contracts.decide,
      name: 'regvoter',
      authorization: [{
        actor: telosAccount,
        permission: 'active'
      }],
      data: {
        voter: telosAccount,
        treasury_symbol: '2,HVOICE',
        referrer: null
      }
    })
  }

  actions.push({
    account: this.$config.contracts.dao,
    name: 'apply',
    authorization: [{
      actor: telosAccount,
      permission: 'active'
    }],
    data: {
      applicant: telosAccount,
      content: reason
    }
  })

  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('setRegistered', true)
  }

  return {
    success: true
  }
}

export const checkMembership = async function ({ commit, state, dispatch }) {
  const selectedDao = this.getters['dao/selectedDao']

  const [memberResponse, applicantResponse] = await Promise.all([this.$apollo.query({
    query: require('~/query/account/dao-member.gql'),
    variables: {
      daoId: selectedDao.docId,
      username: state.account
    }
  }),
  this.$apollo.query({
    query: require('~/query/account/dao-applicant.gql'),
    variables: {
      daoId: selectedDao.docId,
      username: state.account
    }
  })])

  const isMember = memberResponse.data.getDao.member.length === 1
  const isApplicant = applicantResponse.data.getDao.applicant.length === 1

  commit('setApplicant', isApplicant)
  commit('setMembership', isMember)

  if (!isMember) {
    // await dispatch('members/checkRegistration', null, { root: true }) // What is this for?
  } else {
    await dispatch('checkPermissions')
  }
}

export const checkPermissions = async function ({ commit, state }) {
  const account = await this.$api.getAccount(this.$config.contracts.dao)
  if (account) {
    const enrollers = account.permissions.find(p => p.perm_name === 'enrollers')
    if (enrollers) {
      if (enrollers.required_auth.accounts.some(a => a.permission.actor === state.account)) {
        commit('setEnroller', true)
      }
    }
    const admin = account.permissions.find(p => p.perm_name === 'admin')
    if (admin) {
      if (admin.required_auth.accounts.some(a => a.permission.actor === state.account)) {
        commit('setAdmin', true)
      }
    }
  }
}

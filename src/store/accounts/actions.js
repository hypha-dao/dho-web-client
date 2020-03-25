import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

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
      localStorage.setItem('autoLogin', authenticator.constructor.name)
      this.$ppp.setActiveUser(this.$ualUser)
      await dispatch('checkMembership')
      await dispatch('profiles/getPublicProfile', account, { root: true })
      await dispatch('profiles/getDrafts', account, { root: true })
      if (localStorage.getItem('profileApiConnected')) {
        commit('profiles/setConnected', true, { root: true })
      }
    }
  } catch (e) {
    error = (authenticator.getError() && authenticator.getError().message) || e.cause.message
  }
  commit('setLoadingWallet')
  return error
}

export const loginInApp = async function ({ commit, dispatch }, { account, privateKey }) {
  try {
    const signatureProvider = new JsSignatureProvider([privateKey])
    const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

    this.$type = 'inApp'
    this.$inAppUser = api
    this.$inAppUser.getAccountName = () => account
    this.$inAppUser.signTransaction = api.transact
    this.$ppp.setActiveUser(this.$inAppUser)
    if (localStorage.getItem('profileApiConnected')) {
      commit('profiles/setConnected', true, { root: true })
    }
    commit('setAccount', account)
    await dispatch('checkMembership')
    await dispatch('profiles/getPublicProfile', account, { root: true })
    await dispatch('profiles/getDrafts', account, { root: true })
  } catch (e) {
    return 'Invalid private key'
  }
}

export const lightLogin = async function ({ commit, dispatch }, { account, privateKey }) {
  try {
    const signatureProvider = new JsSignatureProvider([privateKey])
    const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

    this.$type = 'inApp'
    this.$inAppUser = api

    commit('setAccount', account)
    await dispatch('checkMembership')
  } catch (e) {
    return 'Invalid private key'
  }
}

export const logout = async function ({ commit }) {
  if (this.$type === 'ual') {
    const wallet = localStorage.getItem('autoLogin')
    const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
    this.$ual.authenticators[idx].logout()
  }

  commit('clearAccount')
  this.$ualUser = null
  this.$inAppUser = null
  this.$type = null
  localStorage.clear()
  commit('profiles/setConnected', false, { root: true })
  if (this.$route.path !== '/roles') {
    this.$router.push({ path: '/roles' })
  }
}

export const autoLogin = async function ({ dispatch, commit }, returnUrl) {
  const wallet = localStorage.getItem('autoLogin')
  const idx = this.$ual.authenticators.findIndex(auth => auth.constructor.name === wallet)
  if (idx !== -1) {
    const authenticator = this.$ual.authenticators[idx]
    await authenticator.init()
    await dispatch('loginWallet', { idx, returnUrl })
  }
}

export const isAccountFree = async function (context, accountName) {
  try {
    await this.$accountApi.get(`/v1/accounts/${accountName}`)
    return false
  } catch (e) {
    // Catch the 404 error if the account doesn't exist
    return true
  }
}

export const sendOTP = async function ({ commit }, form) {
  try {
    await this.$accountApi.post('/v1/registrations', {
      smsNumber: form.internationalPhone,
      telosAccount: form.account
    })
    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

export const verifyOTP = async function ({ commit, state }, { smsOtp, smsNumber, telosAccount, publicKey, privateKey, reason }) {
  try {
    await this.$accountApi.post('/v1/accounts', {
      smsOtp,
      smsNumber,
      telosAccount,
      ownerKey: publicKey,
      activeKey: publicKey
    })

    const signatureProvider = new JsSignatureProvider([privateKey])
    const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
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
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

export const checkMembership = async function ({ commit, state, dispatch }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'members',
    lower_bound: state.account,
    upper_bound: state.account,
    limit: 1
  })
  const membership = result && result.rows.length
  commit('setMembership', membership)
  if (!membership) {
    await dispatch('members/checkRegistration', null, { root: true })
  } else {
    await dispatch('checkEnroller')
  }
}

export const checkEnroller = async function ({ commit, state }) {
  const account = await this.$api.getAccount(this.$config.contracts.dao)
  if (account) {
    const permission = account.permissions.find(p => p.perm_name === 'enrollers')
    if (permission) {
      if (permission.required_auth.accounts.some(a => a.permission.actor === state.account)) {
        commit('setEnroller', true)
      }
    }
  }
}

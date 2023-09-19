import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { MEMBER_TYPE } from '~/const'
import gql from 'graphql-tag'

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

  this.$wallet = authenticator.ualName
  commit('setLoadingWallet', authenticator.getStyle().text)
  await authenticator.init()
  let error
  let account
  try {
    const users = await authenticator.login()
    if (users.length) {
      account = users[0].accountName
      this.$ualUser = users[0]
      this.$type = 'ual'
      this.$ppp.setActiveUser(this.$ualUser)
      await Promise.all([
        dispatch('profiles/getPublicProfile', account, { root: true }),
        dispatch('profiles/getDrafts', account, { root: true })
      ])
      commit('setAccount', account)
      localStorage.setItem('autoLogin', authenticator.ualName)
    }
    localStorage.setItem('known-user', true)
    if (returnUrl) {
      if (this.$router.currentRoute.path !== returnUrl) {
        await this.$router.push({ path: returnUrl, query: this.$router.currentRoute.query })
      }
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
  const tmp3 = localStorage.getItem('proposal-draft')
  localStorage.clear()
  localStorage.setItem('known-user', tmp1)
  localStorage.setItem('drafts', tmp2)
  localStorage.setItem('proposal-draft', tmp3)
  if (this.$type === 'ual') {
    const wallet = this.$wallet || localStorage.getItem('autoLogin')
    const idx = this.$ual.authenticators.findIndex(auth => auth.ualName === wallet)
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

  const daoSettings = this.getters['dao/daoSettings']
  const route = `/${daoSettings.url}/login`
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

export const isAccountAvailable = async function (context, accountName) {
  try {
    await this.$api.getAccount(accountName)
    return false
  } catch {}
  return true
}

export const getHyphaOwners = async function ({ commit, state }) {
  try {
    const { account } = state
    if (!account) return false
    const hypha = await this.$api.getAccount(process.env.DAO_CONTRACT)
    const owners = hypha.permissions.find(_ => _.perm_name === 'active').required_auth.accounts.map(_ => _.permission.actor)
    commit('setIsHyphaOwner', owners.includes(account))
  } catch {}
  return true
}

export const sendOTP = async function ({ commit }, form) {
  const resp = await this.$ppp.authApi()._signUp(form.account)
  const { status, error } = resp

  return {
    success: status !== 403,
    error: error && error.message
  }
}

export const verifyOTP = async function ({ commit, dispatch, state, rootState }, { smsOtp, smsNumber, telosAccount, publicKey, privateKey, reason }) {
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
  // this.$inAppUser.getAccountName = () => account
  this.$inAppUser.signTransaction = api.transact
  // this.$ppp.setActiveUser(this.$inAppUser)
  // commit('setAccount', account)
  // await dispatch('profiles/getPublicProfile', account, { root: true })
  // await dispatch('profiles/getDrafts', account, { root: true })

  // this.$type = 'inApp'
  // this.$inAppUser = api
  // this.$inAppUser.signTransaction = api.transact

  const actions = []

  actions.push({
    account: this.$config.contracts.dao,
    name: 'apply',
    authorization: [{
      actor: telosAccount,
      permission: 'active'
    }],
    data: {
      applicant: telosAccount,
      content: reason,
      dao_id: rootState.dao.docId
    }
  })

  await this.$api.signTransaction(actions)

  return {
    success: true
  }
}

export const applyMember = async function ({ state, rootState, commit }, { content }) {
  const actions = [
    {
      account: this.$config.contracts.dao,
      name: 'apply',
      data: {
        applicant: rootState.accounts.account,
        dao_id: rootState.dao.docId,
        content
      }
    }
  ]

  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('accounts/setApplicant', true, { root: true })
  }
  return result
}

export const removeApplicant = async function ({ commit, rootState }, { applicant }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'remapplicant',
    data: {
      applicant_names: [applicant],
      dao_id: rootState.dao.docId
    }
  }]
  const result = await this.$api.signTransaction(actions)
  return result
}

export const enrollMember = async function ({ commit, rootState }, { applicant, content }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'enroll',
    data: {
      enroller: rootState.accounts.account,
      applicant,
      dao_id: rootState.dao.docId,
      content
    }
  }]
  const result = await this.$api.signTransaction(actions)
  return result
}

export const checkMembership = async function ({ commit, state, dispatch, rootState }) {
  if (!rootState?.dao?.docId || state.account === null) return

  const member = await this.$apollo.query({
    query: gql`
      query member($daoId: String!, $username: String!) {
        getMember(details_member_n: $username) {
          applicantof(filter: { docId: { eq: $daoId } }) {
            docId
          }
          memberof (filter: { docId: { eq: $daoId } }) {
            docId
          }
          adminbdg (filter: { docId: { eq: $daoId } }) {
            docId
          }
          enrollerbdg (filter: { docId: { eq: $daoId } }) {
            docId
          }
        }
      }
      `,
    variables: {
      daoId: rootState.dao.docId,
      username: state.account
    },
    fetchPolicy: 'no-cache'
  })

  if (member?.data?.getMember) {
    const { applicantof, memberof, adminbdg, enrollerbdg } = member?.data?.getMember || {}

    const isApplicant = applicantof?.length === 1
    const isMember = memberof?.length === 1
    const isAdmin = adminbdg?.length === 1
    const isEnroller = enrollerbdg?.length === 1

    commit('setApplicant', isApplicant)
    commit('setMembership', isMember)
    commit('setAdmin', isAdmin)
    commit('setEnroller', isEnroller)

    commit('setMemberType', MEMBER_TYPE.CORE)
    localStorage.setItem('isMember', isMember)
  }

  // TODO: Add when community is ready
  //   const isCoreMember = coreResponse.data.getDao.member.length === 1
  //   const isCommunity = communityResponse.data.getDao.commember.length === 1
  //   const memberType = isCoreMember ? MEMBER_TYPE.CORE : isCommunity ? MEMBER_TYPE.COMMUNITY : ''
  //   localStorage.setItem('memberType', memberType)
  //   commit('setMemberType', memberType)
}

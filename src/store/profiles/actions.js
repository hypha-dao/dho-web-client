import Turndown from 'turndown'
import { nameToUint64 } from '~/utils/eosio'

export const connectProfileApi = async function ({ commit }) {
  await this.$ppp.authApi().signIn()
  localStorage.setItem('profileApiConnected', true)
  commit('setConnected', true)
}

export const getProfile = async function () {
  const profile = await this.$ppp.profileApi().getProfile('BASE_AND_APP')
  if (!profile) return null
  if (profile.publicData.avatar) {
    profile.publicData.avatar = await this.$ppp.profileApi().getImageUrl(profile.publicData.avatar, profile.publicData.s3Identity)
  }
  if (profile.publicData.cover) {
    profile.publicData.cover = await this.$ppp.profileApi().getImageUrl(profile.publicData.cover, profile.publicData.s3Identity)
  }
  return profile
}

export const getPublicProfile = async function ({ commit, state, rootGetters }, username) {
  if (!username) return null

  while (rootGetters['profiles/loadings'][username]) {
    await sleep(200)
  }

  if (rootGetters['profiles/profiles'][username]) {
    return rootGetters['profiles/profiles'][username]
  }
  commit('setLoading', username)
  const profile = (await this.$ppp.profileApi().getProfiles([username]))[username]
  if (!profile) {
    commit('addProfile', { profile, username })
    return null
  }
  if (profile.publicData.avatar) {
    profile.publicData.avatar = await this.$ppp.profileApi().getImageUrl(profile.publicData.avatar, profile.publicData.s3Identity)
  }
  if (profile.publicData.cover) {
    profile.publicData.cover = await this.$ppp.profileApi().getImageUrl(profile.publicData.cover, profile.publicData.s3Identity)
  }
  commit('addProfile', { profile, username })
  return profile
}

export const getDrafts = async function ({ commit }) {
  commit('setDrafts', JSON.parse(localStorage.getItem('drafts')) || [])
}

export const getVoiceToken = async function (context, account) {
  const dho = this.getters['dao/dho']
  const { name: daoName } = this.getters['dao/selectedDao']
  const daoTokens = this.getters['dao/getDaoTokens']

  const lowerLimit = (BigInt(nameToUint64(daoName)) << 64n).toString()
  // eslint-disable-next-line no-loss-of-precision
  const upperLimit = ((BigInt(nameToUint64(daoName)) << BigInt(64)) + BigInt(0xffffffffffffffff)).toString()

  const result = await this.$api.getTableRows({
    code: dho.settings[0].settings_governanceTokenContract_n,
    scope: account,
    table: 'accounts',
    key_type: 'i128',
    index_position: 2,
    lower_bound: lowerLimit,
    upper_bound: upperLimit,
    limit: 1000
  })
  if (result && result.rows && result.rows.length) {
    const row = result.rows[0]
    if (row) {
      const [amount, token] = row.balance.split(' ')
      return { amount, token }
    }
  }
  return { amount: '0.0', token: daoTokens.voiceToken }
}

export const getTokensAmounts = async function (context, account) {
  const tokens = {
    husd: 0.00,
    hvoice: 0.00,
    deferredHypha: 0.00,
    hypha: 0.00,
    liquidSeeds: 0.0000,
    deferredSeeds: 0.0000
  }

  let result = await this.$api.getTableRows({
    code: this.$config.contracts.hvoiceToken,
    scope: account,
    table: 'accounts',
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows.find(r => /HVOICE$/.test(r.balance))
    if (row) {
      tokens.hvoice = parseFloat(row.balance).toFixed(2)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.hyphaToken,
    scope: account,
    table: 'accounts',
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows.find(r => /HYPHA$/.test(r.balance))
    if (row) {
      tokens.hypha = parseFloat(row.balance).toFixed(2)
    }
  }

  const dHyphaLowerLimit = (BigInt(nameToUint64(account)) << 64n).toString()
  // eslint-disable-next-line no-loss-of-precision
  const dHyphaUpperLimit = ((BigInt(nameToUint64(account)) << BigInt(64)) + BigInt(0xffffffffffffffff)).toString()
  result = await this.$api.getTableRows({
    code: this.$config.contracts.deferredHyphaToken,
    scope: this.$config.contracts.deferredHyphaToken,
    table: 'locks',
    index_position: 3,
    key_type: 'i128',
    lower_bound: dHyphaLowerLimit,
    upper_bound: dHyphaUpperLimit,
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    tokens.deferredHypha = result.rows.reduce((acc, row) => acc + parseFloat(row.locked), 0).toFixed(4)
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.husdToken,
    scope: account,
    table: 'accounts',
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows.find(r => /HUSD$/.test(r.balance))
    if (row) {
      tokens.husd = parseFloat(row.balance).toFixed(4)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.seedsEscrow,
    scope: this.$config.contracts.seedsEscrow,
    table: 'locks',
    index_position: 3,
    key_type: 'i64',
    lower_bound: account,
    upper_bound: account,
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    tokens.deferredSeeds = result.rows.reduce((acc, row) => acc + parseFloat(row.quantity), 0).toFixed(4)
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.seedsToken,
    scope: account,
    table: 'accounts',
    limit: 1000
  })

  if (result && result.rows && result.rows.length) {
    tokens.liquidSeeds = parseFloat(result.rows[0].balance).toFixed(4)
  }

  return tokens
}

export const saveProfile = async function ({ commit, state, dispatch, rootState }, { mainForm, aboutForm, detailsForm, tokenRedemptionForm }) {
  if (!state.connected) {
    await dispatch('connectProfileApi')
  }
  let s3Identity
  if (mainForm.avatarFile) {
    mainForm.avatar = await this.$ppp.profileApi().uploadImage(mainForm.avatarFile)
    s3Identity = (await this.$ppp.authApi().userInfo()).id
  }
  if (detailsForm.coverFile) {
    detailsForm.cover = await this.$ppp.profileApi().uploadImage(detailsForm.coverFile)
    s3Identity = (await this.$ppp.authApi().userInfo()).id
  }
  const data = await this.$ppp.profileApi().getProfile('BASE_AND_APP') || {}
  await this.$ppp.profileApi().register({
    ...data,
    emailAddress: mainForm.email,
    smsNumber: mainForm.phoneNumber,
    commPref: mainForm.contactMethod,
    publicData: {
      ...data.publicData,
      ...tokenRedemptionForm,
      name: mainForm.name,
      nickname: mainForm.nickname,
      timeZone: detailsForm.timeZone,
      avatar: mainForm.avatar,
      cover: detailsForm.cover,
      s3Identity,
      tags: detailsForm.tags,
      bio: new Turndown().turndown(aboutForm.bio)
    }
  })
  const profile = (await this.$ppp.profileApi().getProfiles([rootState.accounts.account]))[rootState.accounts.account]
  if (!profile) return null
  if (profile.publicData.avatar) {
    profile.publicData.avatar = await this.$ppp.profileApi().getImageUrl(profile.publicData.avatar, profile.publicData.s3Identity)
  }
  if (profile.publicData.cover) {
    profile.publicData.cover = await this.$ppp.profileApi().getImageUrl(profile.publicData.cover, profile.publicData.s3Identity)
  }
  commit('addProfile', { profile, username: rootState.accounts.account })
}

export const saveAddresses = async function ({ rootState }, { newData, oldData }) {
  const actions = []

  if (newData.btcAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'set',
      data: {
        owner: rootState.accounts.account,
        key: 'btcaddress',
        value: newData.btcAddress,
        notes: ''
      }
    })
  } else if (!newData.btcAddress && newData.btcAddress !== oldData.btcAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'erase',
      data: {
        owner: rootState.accounts.account,
        key: 'btcaddress'
      }
    })
  }

  if (newData.ethAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'set',
      data: {
        owner: rootState.accounts.account,
        key: 'ethaddress',
        value: newData.ethAddress,
        notes: ''
      }
    })
  } else if (!newData.ethAddress && newData.ethAddress !== oldData.ethAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'erase',
      data: {
        owner: rootState.accounts.account,
        key: 'ethaddress'
      }
    })
  }

  if (newData.eosAccount) {
    actions.push({
      account: 'kv.hypha',
      name: 'set',
      data: {
        owner: rootState.accounts.account,
        key: 'eosaccount',
        value: newData.eosAccount,
        notes: ''
      }
    })
  } else if (!newData.eosAccount && newData.eosAccount !== oldData.eosAccount) {
    actions.push({
      account: 'kv.hypha',
      name: 'erase',
      data: {
        owner: rootState.accounts.account,
        key: 'eosaccount'
      }
    })
  }

  if (newData.eosMemo) {
    actions.push({
      account: 'kv.hypha',
      name: 'set',
      data: {
        owner: rootState.accounts.account,
        key: 'eosmemo',
        value: newData.eosMemo,
        notes: ''
      }
    })
  } else if (!newData.eosMemo && newData.eosMemo !== oldData.eosMemo) {
    actions.push({
      account: 'kv.hypha',
      name: 'erase',
      data: {
        owner: rootState.accounts.account,
        key: 'eosmemo'
      }
    })
  }

  if (newData.defaultAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'set',
      data: {
        owner: rootState.accounts.account,
        key: 'defaultaddr',
        value: newData.defaultAddress,
        notes: ''
      }
    })
  } else if (!newData.defaultAddress && newData.defaultAddress !== oldData.defaultAddress) {
    actions.push({
      account: 'kv.hypha',
      name: 'erase',
      data: {
        owner: rootState.accounts.account,
        key: 'defaultaddr'
      }
    })
  }

  return this.$api.signTransaction(actions)
}

export const deleteDraft = async function ({ commit, state, dispatch }, id) {
  const drafts = state.drafts.filter(d => d.draft.id !== id)
  commit('setDrafts', drafts)
  await dispatch('saveDraft')
}

export const saveDraft = async function ({ commit, state, dispatch }, data) {
  const drafts = [...state.drafts]
  // replace an existing draft
  if (data) {
    const { type, draft } = data
    const idx = drafts.findIndex(d => d.draft.id === draft.id && d.type === type)
    if (idx >= 0) {
      drafts[idx] = { type, draft }
    } else {
      drafts.push({ type, draft })
    }
  }
  localStorage.setItem('drafts', JSON.stringify(drafts))
  commit('setDrafts', drafts)
  return true
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

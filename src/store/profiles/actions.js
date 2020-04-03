import Turndown from 'turndown'

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

export const getPublicProfile = async function ({ commit, state }, username) {
  if (!username) return null
  if (state.loadings[username]) {
    while (!state.profiles[username]) {
      await sleep(200)
    }
  }
  if (state.profiles[username]) {
    return state.profiles[username]
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

export const getDrafts = async function ({ commit, state }, username) {
  if (state.loadings[username]) {
    while (!state.profiles[username]) {
      await sleep(200)
    }
  }
  if (state.profiles[username]) {
    commit('setDrafts', state.profiles[username].publicData.drafts || [])
  } else {
    commit('setLoading', username)
    const profile = (await this.$ppp.profileApi().getProfiles([username]))[username]
    if (!profile) return null
    commit('addProfile', { profile, username })
    commit('setDrafts', profile.publicData.drafts || [])
  }
}

export const getTokensAmounts = async function (context, account) {
  const tokens = {
    husd: 0.00,
    hvoice: 0.00,
    hypha: 0.00,
    liquidSeeds: 0.0000,
    deferredSeeds: 0.0000
  }

  let result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: account,
    table: 'voters'
  })

  if (result && result.rows && result.rows.length) {
    const row = result.rows.find(r => /HVOICE$/.test(r.liquid))
    if (row) {
      tokens.hvoice = parseFloat(row.liquid).toFixed(2)
    }
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.hyphaToken,
    scope: account,
    table: 'accounts'
  })

  if (result && result.rows && result.rows.length) {
    let row = result.rows.find(r => /HYPHA$/.test(r.balance))
    if (row) {
      tokens.hypha = parseFloat(row.balance).toFixed(2)
    }
    row = result.rows.find(r => /HUSD$/.test(r.balance))
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
    upper_bound: account
  })

  if (result && result.rows && result.rows.length) {
    tokens.deferredSeeds = result.rows.reduce((acc, row) => acc + parseFloat(row.quantity), 0).toFixed(4)
  }

  result = await this.$api.getTableRows({
    code: this.$config.contracts.seedsToken,
    scope: account,
    table: 'accounts'
  })

  if (result && result.rows && result.rows.length) {
    tokens.liquidSeeds = parseFloat(result.rows[0].balance).toFixed(4)
  }

  return tokens
}

export const saveProfile = async function ({ commit, state, dispatch, rootState }, { mainForm, aboutForm, detailsForm }) {
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

export const deleteDraft = async function ({ commit, state, dispatch }, id) {
  const drafts = state.drafts.filter(d => d.draft.id !== id)
  commit('setDrafts', drafts)
  await dispatch('saveDraft')
}

export const saveDraft = async function ({ commit, state, dispatch }, data) {
  if (!state.connected) {
    await dispatch('connectProfileApi')
  }
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
  const profile = await this.$ppp.profileApi().getProfile('BASE_AND_APP')
  await this.$ppp.profileApi().register({
    ...profile,
    publicData: {
      ...profile.publicData,
      drafts
    }
  })
  commit('setDrafts', drafts)
  return true
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

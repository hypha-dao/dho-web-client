export const me = async function ({ commit }, accountName) {
  try {
    const { profile } = await this.$axios.get(`${process.env.WEBSERVICE_PROFILE}/profile/${accountName}`)
    commit('setProfile', {
      accountName,
      profile
    })
  } catch {
    commit('setProfile', {
      accountName
    })
  }
}

export const update = async function ({ commit, state }, profile) {
  await this.$axios.post(`${process.env.WEBSERVICE_PROFILE}/profile`, {
    accountName: state.accountName,
    profile
  }, {
    headers: {
      'x-api-key': process.env.WEBSERVICE_PROFILE_API_KEY
    }
  })
  commit('updateProfile', profile)
}

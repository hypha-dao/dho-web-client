
export const loadAlert = async function ({ commit }) {
  const response = await this.$apollo.query({
    query: require('~/query/dho-alerts.gql')
  })
  const level = response.data.queryDho[0].alert[0].details_level_n
  const content = response.data.queryDho[0].alert[0].details_content_s
  if (level && content) {
    commit('setAlert', { level, content })
    return { level, content }
  }
  return null
}

export const saveAlert = async function (context, { level, content }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'setalert',
    data: {
      level,
      content
    }
  }]

  return this.$api.signTransaction(actions)
}

export const removeAlert = async function () {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'remalert',
    data: {
      notes: ''
    }
  }]

  return this.$api.signTransaction(actions)
}

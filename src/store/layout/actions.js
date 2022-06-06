export const loadAlert = async function ({ commit }) {
  const response = await this.$apollo.query({
    query: require('~/query/dho-alerts.gql')
  })
  const level = response.data.queryDho[0].alert[0]?.details_level_n
  const content = response.data.queryDho[0].alert[0]?.details_content_s
  if (level && content) {
    commit('setAlert', { level, content })
    return { level, content }
  }
  return null
}

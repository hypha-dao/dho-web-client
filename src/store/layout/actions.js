export const loadAlert = async function ({ commit }) {
  const response = await this.$apollo.query({
    query: require('~/query/dao-alerts.gql')
  })
  if (response.data.queryAlert.length) {
    const { level, content } = response.data.queryAlert[0].level
    if (level && content) {
      commit('setAlert', { level, content })
      return { level, content }
    }
  }
  return null
}

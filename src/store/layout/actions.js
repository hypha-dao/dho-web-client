export const loadAlert = async function ({ commit }) {
  const response = await this.$apollo.query({
    query: require('~/query/dho-alerts.gql')
  })

  const alerts = [...response.data.queryDho[0]?.alert].map(_ => ({ ..._, enabled: Boolean(_.enabled) }))

  if (alerts.length) {
    commit('dao/setAlerts', alerts, { root: true })

    const activeAlert = alerts.find(_ => _.enabled === true) // Only one alert can be shown at the time

    if (activeAlert) {
      const { level, content } = activeAlert
      commit('setAlert', { level, content })
      return { level, content }
    }
  }

  return null
}

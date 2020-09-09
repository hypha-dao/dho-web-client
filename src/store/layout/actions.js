export const loadAlert = async function ({ commit }) {
  const result = await this.$api.getTableRows({
    code: process.env.DAO_CONTRACT,
    scope: process.env.DAO_CONTRACT,
    table: 'config'
  })
  if (result && result.rows.length) {
    const level = result.rows[0].names.find(o => o.key === 'alert_level')
    const content = result.rows[0].strings.find(o => o.key === 'alert_content')
    if (level && content) {
      commit('setAlert', { level: level.value, content: content.value })
      return { level: level.value, content: content.value }
    }
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
    name: 'remalert'
  }]

  return this.$api.signTransaction(actions)
}

import { getValueFromDocument } from '~/mixins/documents'

export const loadAlert = async function ({ commit }) {
  const query = `
  query alerts() {
    var(func: has(alert)){
        alerts as alert{}
    }
    alerts(func: uid(alerts)){
      expand(_all_){
        expand(_all_){
          expand(_all_)
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().query(query)
  if (result && result.data && result.data.alerts && result.data.alerts.length) {
    const level = getValueFromDocument(result.data.alerts[0], 'details', 'level')
    const content = getValueFromDocument(result.data.alerts[0], 'details', 'content')
    if (level && content) {
      commit('setAlert', { level, content })
      return { level, content }
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
    name: 'remalert',
    data: {
      notes: ''
    }
  }]

  return this.$api.signTransaction(actions)
}

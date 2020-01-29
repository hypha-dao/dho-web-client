export const fetchRole = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'roles',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    return result.rows[0]
  }
  return null
}

export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'roles',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].role_id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addRoles', result)
}

export const saveProposal = async function ({ commit, rootState }, { title, description, content, hyphaAmount, seedsAmount, hvoiceAmount, startPeriod, endPeriod }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      names: [
        { key: 'proposal_type', value: 'roles' },
        { key: 'proposer', value: rootState.accounts.account },
        { key: 'trx_action_name', value: 'newrole' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: description },
        { key: 'content', value: content }
      ],
      assets: [
        { key: 'hypha_amount', value: `${parseFloat(hyphaAmount).toFixed(2)} HYPHA` },
        { key: 'seeds_amount', value: `${parseFloat(seedsAmount).toFixed(4)} SEEDS` },
        { key: 'hvoice_amount', value: `${parseFloat(hvoiceAmount).toFixed(2)} HVOICE` }
      ],
      time_points: [],
      ints: [
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value }
      ],
      floats: [],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}

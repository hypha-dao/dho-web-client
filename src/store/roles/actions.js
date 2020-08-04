import Turndown from 'turndown'

export const fetchRole = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'role',
    table: 'objects',
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
    scope: 'role',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addRoles', result)
}

export const saveRoleProposal = async function ({ commit, rootState }, { edit, id, title, description, url, salaryUsd, salaryCommitted, salaryDeferred, salaryCapacity, startPeriod, endPeriod }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: edit ? 'edit' : 'create',
    data: {
      scope: edit ? 'role' : 'proposal',
      names: [
        { key: 'type', value: 'role' },
        { key: 'owner', value: rootState.accounts.account },
        { key: 'trx_action_name', value: 'newrole' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: new Turndown().turndown(description) },
        { key: 'url', value: url }
      ],
      assets: [
        { key: 'annual_usd_salary', value: `${parseFloat(salaryUsd).toFixed(2)} USD` }
      ],
      time_points: [],
      ints: [
        { key: 'min_time_share_x100', value: Math.round(parseFloat(salaryCommitted)) },
        { key: 'min_deferred_x100', value: Math.round(parseFloat(salaryDeferred)) },
        { key: 'fulltime_capacity_x100', value: Math.round(parseFloat(salaryCapacity) * 100) },
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value }
      ],
      floats: [],
      trxs: []
    }
  }]
  if (edit) {
    actions[0].data.id = id
  }
  return this.$api.signTransaction(actions)
}

export const suspendRole = async function ({ rootState }, id) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propsuspend',
    data: {
      scope: 'role',
      proposer: rootState.accounts.account,
      id
    }
  }]

  return this.$api.signTransaction(actions)
}

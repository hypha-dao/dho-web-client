import Turndown from 'turndown'

export const fetchAssignment = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'assignment',
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
    scope: 'assignment',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })
  commit('addAssignments', result)
}

export const saveAssignmentProposal = async function ({ commit, rootState }, { title, description, url, role, startPeriod, endPeriod, salaryCommitted, salaryDeferred }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'create',
    data: {
      scope: 'proposal',
      names: [
        { key: 'type', value: 'assignment' },
        { key: 'owner', value: rootState.accounts.account },
        { key: 'assigned_account', value: rootState.accounts.account },
        { key: 'trx_action_name', value: 'assign' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: new Turndown().turndown(description) },
        { key: 'url', value: url }
      ],
      assets: [],
      time_points: [],
      ints: [
        { key: 'min_time_share_x100', value: Math.round(parseFloat(salaryCommitted) * 100) },
        { key: 'min_deferred_x100', value: Math.round(parseFloat(salaryDeferred) * 100) },
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value },
        { key: 'role_id', value: role.id }
      ],
      floats: [],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}

export const getUserAssignments = async function (context, account) {
  let userAssignments = []
  let more = true
  let results = { rows: [] }
  while (more) {
    results = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: 'assignment',
      table: 'objects',
      lower_bound: results.rows.length ? results.rows[results.rows.length - 1].id : '',
      limit: 1000,
      reverse: true
    })
    userAssignments = userAssignments.concat(results.rows.filter(r => {
      const obj = r.names.find(n => n.key === 'assigned_account')
      return obj && obj.value === account
    }))
    more = results.more
  }
  return userAssignments
}

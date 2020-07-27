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

export const fetchData = async function ({ commit, state }, username) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'assignment',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })
  if (username && result.rows.length) {
    result.rows = result.rows.filter(r => {
      const data = r.names.find(k => k.key === 'assigned_account')
      return data && data.value === username
    })
  }
  commit('addAssignments', result)
}

export const saveAssignmentProposal = async function ({ commit, rootState }, { edit, id, title, description, url, role, startPeriod, endPeriod, salaryCommitted, salaryDeferred, salaryInstantHUsd }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: edit ? 'edit' : 'create',
    data: {
      scope: edit ? 'assignment' : 'proposal',
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
        { key: 'time_share_x100', value: Math.round(parseFloat(salaryCommitted)) },
        { key: 'deferred_perc_x100', value: Math.round(parseFloat(salaryDeferred)) },
        { key: 'instant_husd_perc_x100', value: Math.round(parseFloat(salaryInstantHUsd)) },
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value },
        { key: 'role_id', value: role.id }
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
export const getClaimedPeriods = async function (context, assignment) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'asspayouts',
    lower_bound: assignment,
    upper_bound: assignment,
    index_position: 2,
    key_type: 'i64',
    limit: 1000
  })
  if (result && result.rows.length) {
    return result.rows
  }
  return null
}

export const claimAssignmentPayment = async function (context, { assignment, periods }) {
  const actions = []
  periods.forEach(id => {
    actions.push({
      account: this.$config.contracts.dao,
      name: 'payassign',
      data: {
        assignment_id: assignment,
        period_id: id
      }
    })
  })
  return this.$api.signTransaction(actions)
}

export const fetchAssignments = async function ({ commit, state }) {
  commit('clearAssignments')
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'assignments',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].assignment_id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addAssignments', result)
}

export const saveProposal = async function ({ commit, rootState }, { title, description, content, recipient, role, timeShare, startPeriod, endPeriod }) {
  const actions = [{
    account: process.env.SMARTCONTRACT,
    name: 'propose',
    data: {
      names: [
        { key: 'proposal_type', value: 'assignments' },
        { key: 'proposer', value: rootState.accounts.account },
        { key: 'assigned_account', value: recipient },
        { key: 'trx_action_name', value: 'assign' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: description },
        { key: 'content', value: content }
      ],
      assets: [],
      time_points: [],
      ints: [
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value },
        { key: 'role_id', value: role.value }
      ],
      floats: [
        { key: 'time_share', value: (parseFloat(timeShare) / 100).toFixed(2) }
      ],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}

export const fetchProposal = async function (context, { type, id }) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: type,
    table: 'proposals',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    return result.rows[0]
  }
  return null
}

export const fetchProposals = async function ({ commit, state }) {
  const assignments = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: 'assignments',
    table: 'proposals',
    lower_bound: state.list.assignments.data.length ? parseInt(new Date(state.list.assignments.data[state.list.assignments.data.length - 1].created_date).getTime() / 1000) : null,
    index_position: 2, // by created
    key_type: 'i64',
    limit: state.list.pagination.limit
  })

  const payouts = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: 'payouts',
    table: 'proposals',
    lower_bound: state.list.payouts.data.length ? parseInt(new Date(state.list.payouts.data[state.list.payouts.data.length - 1].created_date).getTime() / 1000) : null,
    index_position: 2, // by created
    key_type: 'i64',
    limit: state.list.pagination.limit
  })

  const roles = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: 'roles',
    table: 'proposals',
    lower_bound: state.list.roles.data.length ? parseInt(new Date(state.list.roles.data[state.list.roles.data.length - 1].created_date).getTime() / 1000) : null,
    index_position: 2, // by created
    key_type: 'i64',
    limit: state.list.pagination.limit
  })

  commit('addProposals', { assignments, payouts, roles })
}

export const closeProposal = async function (context, { type, id }) {
  const actions = [{
    account: process.env.SMARTCONTRACT,
    name: 'closeprop',
    data: {
      proposal_type: type,
      proposal_id: id
    }
  }]

  return this.$api.signTransaction(actions)
}

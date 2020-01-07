export const fetchProposal = async function (context, id) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
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

export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'proposals',
    lower_bound: state.list.data.length ? parseInt(new Date(state.list.data[state.list.data.length - 1].created_date).getTime() / 1000) : null,
    index_position: 2, // by created
    key_type: 'i64',
    limit: state.list.pagination.limit
  })

  commit('addProposals', result)
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

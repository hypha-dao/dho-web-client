export const fetchRole = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roles',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    commit('addRole', result.rows[0])
  }
}

export const fetchRoles = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roles',
    lower_bound: state.roles.items.length ? state.roles.items[state.roles.items.length - 1].role_id : '',
    limit: state.roles.limit
  })

  commit('addRoles', result)
}

export const fetchRoleProposals = async function ({ commit, dispatch, state }) {
  const roleProposals = await this.$api.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roleprops',
    lower_bound: state.roleProposals.items.length ? state.roleProposals.items[state.roleProposals.items.length - 1].proposal_id : '',
    limit: state.roleProposals.limit,
    reversed: true
  })

  commit('addRoleProposals', roleProposals)

  for (const proposal of roleProposals.rows) {
    await dispatch('trail/fetchBallots', proposal.ballot_id, { root: true })
  }
}

export const submitProposal = async function ({ commit, rootState }, payload) {
  const actions = [{
    account: process.env.SMARTCONTRACT,
    name: 'proposerole',
    data: {
      proposer: rootState.accounts.account,
      role_name: payload.title,
      description: payload.description,
      info_url: payload.url || '',
      hypha_salary: `${parseFloat(payload.hyphaSalary).toFixed(4)} HYPHA`,
      preseeds_salary: `${parseFloat(payload.preseedsSalary).toFixed(4)} SEEDS`,
      voice_salary: `${parseFloat(payload.voiceSalary).toFixed(4)} HVOICE`,
      start_period: payload.startPeriod.value,
      end_period: payload.endPeriod.value
    }
  }]

  return this.$api.signTransaction(actions)
}

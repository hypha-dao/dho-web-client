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
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].role_id : '',
    limit: state.list.pagination.limit,
    reverse: true
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

export const saveProposal = async function ({ commit, rootState }, { title, description, content, hyphaAmount, seedsAmount, hvoiceAmount, startPeriod, endPeriod }) {
  const actions = [{
    account: process.env.SMARTCONTRACT,
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
        { key: 'hypha_amount', value: `${parseInt(hyphaAmount)} HYPHA` },
        { key: 'seeds_amount', value: `${parseFloat(seedsAmount).toFixed(8)} SEEDS` },
        { key: 'hvoice_amount', value: `${parseInt(hvoiceAmount)} HVOICE` }
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

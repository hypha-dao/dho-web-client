export const fetchRole = async function ({ commit, state }, id) {
  const result = await this.$transit.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roles',
    lowerBound: parseInt(id),
    upperBound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    commit('addRole', result.rows[0])
  }
}

export const fetchRoles = async function ({ commit, state }) {
  const result = await this.$transit.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roles',
    lowerBound: state.roles.items.length ? state.roles.items[state.roles.items.length - 1].role_id : '',
    limit: state.roles.limit
  })

  commit('addRoles', result)
}

export const fetchRoleProposals = async function ({ commit, dispatch, state }) {
  const roleProposals = await this.$transit.getTableRows({
    code: process.env.SMARTCONTRACT,
    scope: process.env.SMARTCONTRACT,
    table: 'roleprops',
    lowerBound: state.roleProposals.items.length ? state.roleProposals.items[state.roleProposals.items.length - 1].proposal_id : '',
    limit: state.roleProposals.limit,
    reversed: true
  })

  commit('addRoleProposals', roleProposals)

  for (const proposal of roleProposals.rows) {
    await dispatch('trail/fetchBallots', proposal.ballot_id, { root: true })
  }
}

export const submitProposal = async function ({ commit, rootState }, payload) {
  const notification = {
    icon: 'fas fa-person-booth',
    title: 'Role proposal',
    content: payload.title
  }
  try {
    const transaction = await this.$transitApi.transact({
      actions: [{
        account: process.env.SMARTCONTRACT,
        name: 'proposerole',
        authorization: [{
          actor: rootState.wallet.accountName,
          permission: 'active'
        }],
        data: {
          proposer: rootState.wallet.accountName,
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
    }, {
      sign: true,
      broadcast: true,
      blocksBehind: 3,
      expireSeconds: 60
    })

    notification.status = 'success'
    notification.transaction = transaction
    commit('loadNewProposals')
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

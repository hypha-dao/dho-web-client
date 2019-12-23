export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.getTableRows({
    code: 'trailservice',
    scope: 'trailservice',
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })
  return result.rows.length && result.rows[0]
}

export const fetchBallots = async function ({ commit, state }, ballotId) {
  if (!state.ballots.some(b => b.ballot_id === ballotId)) {
    const ballots = await this.$api.getTableRows({
      code: process.env.TRAILCONTRACT,
      scope: process.env.TRAILCONTRACT,
      table: 'ballots',
      lower_bound: ballotId,
      limit: 100
    })
    commit('addBallots', ballots.rows)

    for (const ballot of state.ballots) {
      if (!ballot.prop_id) {
        const proposals = await this.$api.getTableRows({
          code: process.env.TRAILCONTRACT,
          scope: process.env.TRAILCONTRACT,
          table: 'proposals',
          lower_bound: ballot.reference_id,
          limit: 100
        })
        commit('addProposals', proposals.rows)
      }
    }
    commit('flushProposals')
  }
}

export const castVote = async function ({ rootState, commit }, { direction, ballot }) {
  const notification = {
    icon: 'fas fa-vote-yea',
    title: 'Proposal vote',
    content: getVoteDirectionContent(direction)
  }
  try {
    const transaction = await this.$transitApi.transact({
      actions: [{
        account: process.env.TRAILCONTRACT,
        name: 'castvote',
        authorization: [{
          actor: rootState.accounts.account,
          permission: 'active'
        }],
        data: {
          voter: rootState.accounts.account,
          ballot_id: ballot,
          direction
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
  } catch (e) {
    notification.status = 'error'
    notification.error = e.message
  }
  commit('notifications/addNotification', notification, { root: true })
  return notification.status === 'success'
}

const getVoteDirectionContent = (direction) => {
  if (direction === 0) {
    return 'Disapprove'
  } else if (direction === 1) {
    return 'No opinion'
  } else if (direction === 2) {
    return 'Approve'
  }
  return 'unknown'
}

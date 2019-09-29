export const fetchBallots = async function ({ commit, state }, ballotId) {
  if (!state.ballots.some(b => b.ballot_id === ballotId)) {
    const ballots = await this.$transit.getTableRows({
      code: process.env.TRAILCONTRACT,
      scope: process.env.TRAILCONTRACT,
      table: 'ballots',
      lowerBound: ballotId,
      limit: 100
    })
    commit('addBallots', ballots.rows)

    for (const ballot of state.ballots) {
      if (!ballot.prop_id) {
        const proposals = await this.$transit.getTableRows({
          code: process.env.TRAILCONTRACT,
          scope: process.env.TRAILCONTRACT,
          table: 'proposals',
          lowerBound: ballot.reference_id,
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
          actor: rootState.wallet.accountName,
          permission: 'active'
        }],
        data: {
          voter: rootState.wallet.accountName,
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

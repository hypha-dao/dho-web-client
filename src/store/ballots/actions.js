export const getSupply = async function ({ commit }) {
  commit('setSupplyLoading', true)
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'treasuries',
    lower_bound: 'HVOICE',
    upper_bound: 'HVOICE'
  })
  if (result && result.rows.length) {
    commit('setSupply', result.rows[0].supply)
  }

  commit('setSupplyLoading', false)
}

export const fetchBallot = async function ({ commit }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'ballots',
    limit: 1,
    lower_bound: id,
    upper_bound: id
  })
  commit('addBallot', { id, ballot: result.rows.length && result.rows[0] })
}

export const castVote = async function ({ rootState, commit }, { id, vote }) {
  const actions = [{
    account: this.$config.contracts.decide,
    name: 'castvote',
    data: {
      voter: rootState.accounts.account,
      ballot_name: id,
      options: [vote]
    }
  }]
  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('setUserVote', { vote, id })
  }
}

export const getUserVote = async function ({ commit }, { user, id }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: id,
    table: 'votes',
    lower_bound: user,
    upper_bound: user
  })
  if (result && result.rows.length) {
    commit('setUserVote', { vote: result.rows[0].weighted_votes.length && result.rows[0].weighted_votes[0].key, id })
  }
}

export const getUsersVote = async function (context, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: id,
    table: 'votes',
    limit: 2000
  })
  if (result && result.rows.length) {
    return result.rows
  }
  return []
}

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

export const castVote = async function ({ rootState, commit }, { id, vote }) {
  const actions = [{
    account: 'trailservice',
    name: 'castvote',
    data: {
      voter: rootState.accounts.account,
      ballot_name: id,
      options: [vote]
    }
  }]
  return this.$api.signTransaction(actions)
}

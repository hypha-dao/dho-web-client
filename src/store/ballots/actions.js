import { nameToUint64 } from 'eosjs-account-name'

export const getSupplyOld = async function ({ commit }) {
  commit('setSupplyLoading', true)
  let supply = 0
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.hvoiceToken,
    scope: 'HVOICE',
    table: 'stat'
  })
  if (result && result.rows.length) {
    supply = result.rows[0].supply
    commit('setSupply', supply)
  }

  commit('setSupplyLoading', false)
  return supply
}

export const getSupply = async function ({ rootState, commit }) {
  commit('setSupplyLoading', true)
  let supply = 0

  if (!rootState.dao.name) return null

  const lowerBound = (BigInt(nameToUint64(rootState.dao.name)) << 64n).toString()
  const upperBound = ((BigInt(nameToUint64(rootState.dao.name)) << BigInt(64)) + BigInt(0xffffffffffff)).toString()

  const result = await this.$api.getTableRows({
    code: process.env.SUPPLY_CONTRACT,
    scope: 'VOICE',
    index_position: 2,
    key_type: 'i128',
    lower_bound: lowerBound,
    upper_bound: upperBound,
    table: 'stat'
  })
  if (result && result.rows.length) {
    supply = result.rows[0].supply
    commit('setSupply', supply)
  }

  commit('setSupplyLoading', false)
  return supply
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

export const castVote = async function ({ rootState, commit }, { hash, vote }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'vote',
    data: {
      voter: rootState.accounts.account,
      proposal_hash: hash,
      vote,
      notes: ''
    }
  }]
  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('setUserVote', { vote, hash })
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

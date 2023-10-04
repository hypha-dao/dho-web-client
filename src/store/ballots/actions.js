import { nameToUint64 } from 'eosjs-account-name'
import { Screen } from 'quasar'
import I18n from '~/utils/i18n'

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

  const { voiceToken: scope } = this.getters['dao/getDaoTokens']
  const lowerBound = (BigInt(nameToUint64(rootState.dao.name)) << 64n).toString()
  const upperBound = ((BigInt(nameToUint64(rootState.dao.name)) << BigInt(64)) + BigInt(0xffffffffffff)).toString()

  const result = await this.$api.getTableRows({
    code: process.env.SUPPLY_CONTRACT,
    scope: scope,
    index_position: 2,
    key_type: 'i128',
    lower_bound: lowerBound,
    upper_bound: upperBound,
    table: 'stat.v2'
  })
  if (result && result.rows.length) {
    supply = result.rows[0].supply
  }
  commit('setSupply', supply)

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

export const castVote = async function ({ rootState, commit }, { docId, vote }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'vote',
    data: {
      voter: rootState.accounts.account,
      proposal_id: docId,
      vote,
      notes: ''
    }
  }]
  let options = {}
  if (Screen.gt.md) {
    options = {
      title: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.title'),
      text: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.text'),
      actionText: I18n.t('hypha-wallet-pop-up.signTransaction.desktop.actionText')
    }
  } else {
    options = {
      title: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.title'),
      text: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.text'),
      actionText: I18n.t('hypha-wallet-pop-up.signTransaction.mobile.actionText')
    }
  }
  const result = await this.$api.signTransaction(actions, options)
  if (result) {
    commit('setUserVote', { vote, docId })
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

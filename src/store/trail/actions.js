import { Screen } from 'quasar'
import I18n from '~/utils/i18n'
export const fetchBallot = async function ({ commit }, ballot) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'ballots',
    limit: 1,
    lower_bound: ballot,
    upper_bound: ballot
  })
  return result.rows.length && result.rows[0]
}

export const getSupply = async function () {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: this.$config.contracts.decide,
    table: 'treasuries',
    lower_bound: 'HVOICE',
    upper_bound: 'HVOICE'
  })
  if (result && result.rows.length) {
    return result.rows[0].supply
  }
  return 0
}

export const castVote = async function ({ rootState, commit }, { id, vote, proposalId }) {
  const actions = [{
    account: this.$config.contracts.decide,
    name: 'castvote',
    data: {
      voter: rootState.accounts.account,
      ballot_name: id,
      options: [vote]
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
    commit('setLastVote', { vote, proposalId })
  }
  return result
}

export const getUserVote = async function (context, { user, ballot }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: ballot,
    table: 'votes',
    lower_bound: user,
    upper_bound: user
  })
  if (result && result.rows.length) {
    return result.rows[0].weighted_votes.length && result.rows[0].weighted_votes[0].key
  }
  return null
}

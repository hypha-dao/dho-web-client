import { Screen } from 'quasar'
import I18n from '~/utils/i18n'

export const claimAssignmentPayment = async function (context, docId) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'claimnextper',
    data: {
      assignment_id: docId
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
  return this.$api.signTransaction(actions, options)
}
export const claimAllAssignmentPayment = async function (context, { docId, numPeriods }) {
  const actions = []
  for (let i = 0; i < numPeriods; i++) {
    actions.push({
      account: this.$config.contracts.dao,
      name: 'claimnextper',
      data: {
        assignment_id: docId
      }
    })
  }
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
  return this.$api.signTransaction(actions, options)
}

export const adjustCommitment = async function ({ rootState }, { docId, commitment }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustcmtmnt',
    data: {
      issuer: rootState.accounts.account,
      adjust_info: [
        [
          { label: 'assignment', value: ['int64', docId] },
          { label: 'new_time_share_x100', value: ['int64', commitment] }
        ]
      ]
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
  return this.$api.signTransaction(actions, options)
}

export const adjustDeferred = async function ({ rootState }, { docId, deferred }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustdeferr',
    data: {
      issuer: rootState.accounts.account,
      assignment_id: docId,
      new_deferred_perc_x100: deferred
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
  return this.$api.signTransaction(actions, options)
}

export const suspendAssignment = async function ({ rootState }, { docId, reason }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'suspend',
    data: {
      reason,
      proposer: rootState.accounts.account,
      document_id: docId
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
  return this.$api.signTransaction(actions, options)
}

export const withdrawFromAssignment = async function ({ rootState }, { docId, notes }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'withdraw',
    data: {
      notes,
      owner: rootState.accounts.account,
      document_id: docId
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
  return this.$api.signTransaction(actions, options)
}

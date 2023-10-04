import { Screen } from 'quasar'
import I18n from '~/utils/i18n'
export const getHyphaProposals = async function () {
  const actionProposals = {
    code: process.env.MULTISIG_CONTRACT,
    scope: process.env.MULTISIG_CONTRACT,
    table: 'proposals',
    limit: 1000
  }
  const proposals = await this.$api.getTableRows(actionProposals)

  const actionDocuments = {
    code: process.env.MULTISIG_CONTRACT,
    scope: process.env.MULTISIG_CONTRACT,
    table: 'documents',
    limit: 1000
  }
  const documents = await this.$api.getTableRows(actionDocuments)

  for (const proposal of proposals.rows) {
    proposal.document = documents.rows.find(d => d.hash === proposal.document_hash)
    proposal.type = 'HYPHA'

    const actionApproval = {
      code: 'eosio.msig',
      scope: proposal.proposer,
      table: 'approvals2',
      limit: 1000,
      lower_bound: proposal.proposal_name,
      upper_bound: proposal.proposal_name
    }
    const approval = await this.$api.getTableRows(actionApproval)
    if (approval.rows && approval.rows.length) {
      proposal.provided_approvals = approval.rows[0].provided_approvals
      proposal.requested_approvals = approval.rows[0].requested_approvals
    } else {
      proposal.provided_approvals = []
      proposal.requested_approvals = []
    }
  }

  return proposals.rows
}

export const getSeedsProposals = async function () {

}

export const approve = async function ({ rootState }, { proposer, proposalName, level }) {
  const actions = [{
    account: 'eosio.msig',
    name: 'approve',
    data: {
      proposer,
      proposal_name: proposalName,
      level: {
        actor: rootState.accounts.account,
        permission: level
      }
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

export const unapprove = async function ({ rootState }, { proposer, proposalName, level }) {
  const actions = [{
    account: 'eosio.msig',
    name: 'unapprove',
    data: {
      proposer,
      proposal_name: proposalName,
      level: {
        actor: rootState.accounts.account,
        permission: level
      }
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

export const execute = async function ({ rootState }, { proposer, proposalName }) {
  const actions = [{
    account: 'eosio.msig',
    name: 'exec',
    data: {
      proposer,
      proposal_name: proposalName,
      executer: rootState.accounts.account
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

export const cancel = async function ({ rootState }, { proposer, proposalName }) {
  const actions = [{
    account: 'eosio.msig',
    name: 'cancel',
    data: {
      proposer,
      proposal_name: proposalName,
      canceler: rootState.accounts.account
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

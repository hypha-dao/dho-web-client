export const getHyphaProposals = async function () {
  const actionProposals = {
    code: 'msig.hypha',
    scope: 'msig.hypha',
    table: 'proposals',
    limit: 1000
  }
  const proposals = await this.$api.getTableRows(actionProposals)

  const actionDocuments = {
    code: 'msig.hypha',
    scope: 'msig.hypha',
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

  return this.$api.signTransaction(actions)
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

  return this.$api.signTransaction(actions)
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

  return this.$api.signTransaction(actions)
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

  return this.$api.signTransaction(actions)
}

export const getHyphaProposals = async function () {
  const actionProposals = {
    code: 'msig.hypha',
    scope: 'msig.hypha',
    table: 'proposal',
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
  }

  return proposals.rows
}

export const getSeedsProposals = async function () {

}

export const approve = async function ({ rootState }, { proposalName, level }) {
  const actions = [{
    account: 'msig.hypha',
    name: 'approve',
    data: {
      proposal_name: proposalName,
      level: {
        actor: rootState.accounts.account,
        permission: level
      }
    }
  }]

  return this.$api.signTransaction(actions)
}

export const unapprove = async function ({ rootState }, { proposalName, level }) {
  const actions = [{
    account: 'msig.hypha',
    name: 'unapprove',
    data: {
      proposal_name: proposalName,
      level: {
        actor: rootState.accounts.account,
        permission: level
      }
    }
  }]

  return this.$api.signTransaction(actions)
}

export const execute = async function ({ rootState }, { proposalName }) {
  const actions = [{
    account: 'msig.hypha',
    name: 'exec',
    data: {
      proposal_name: proposalName,
      executer: rootState.accounts.account
    }
  }]

  return this.$api.signTransaction(actions)
}

export const cancel = async function ({ rootState }, { proposalName }) {
  const actions = [{
    account: 'msig.hypha',
    name: 'cancel',
    data: {
      proposal_name: proposalName,
      canceler: rootState.accounts.account
    }
  }]

  return this.$api.signTransaction(actions)
}

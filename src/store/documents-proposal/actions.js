export const closeDocumentProposal = async function (context, hash) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'closedocprop',
    data: {
      proposal_hash: hash
    }
  }]

  return this.$api.signTransaction(actions)
}

export const fetchProposal = async function (context, $hash) {
  const query = `
  query proposal($hash:string) {
    proposal(func: eq(hash, $hash)) {
      expand(_all_) {
        expand(_all_) {
          expand(_all_) {
            expand(_all_)
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $hash })
  if (result.data.proposal.length) {
    return result.data.proposal[0]
  }
  return null
}

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

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
      uid
      hash
      creator
      created_date
      content_groups {
        contents {
          label
          value
          type
        }
      }
      votetally{
        hash
        creator
        created_date
        content_groups {
          contents {
            label
            value
            type
          }
        }
      }
      vote {
        hash
        creator
        created_date
        content_groups {
          contents {
            label
            value
            type
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

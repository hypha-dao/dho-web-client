export const apply = async function ({ state, rootState, commit }, { content }) {
  const actions = []
  const selectedDao = this.getters['dao/selectedDao']

  actions.push({
    account: this.$config.contracts.dao,
    name: 'apply',
    data: {
      applicant: rootState.accounts.account,
      dao_hash: selectedDao.hash, // TODO: Change this for docId
      content
    }
  })

  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('accounts/setApplicant', true, { root: true })
  }
  return result
}

export const loadMembers = async function ({ commit }, { first, offset }) {
  const query = `
  query members($first:int, $offset: int){
    var(func: uid(${this.$config.dho})){
      members as member @cascade{
        created_date
      }
    }
    members(func: uid(members), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        contents {
          label
          value
          type
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addMembers', result.data.members)
  return result.data.members.length === 0
}

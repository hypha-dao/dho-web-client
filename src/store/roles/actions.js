import Turndown from 'turndown'

export const saveRoleProposal = async function ({ rootState }, draft) {
  /*
  TODO draft.edit draft.id
  if (edit) {
    actions[0].data.id = id
  }
*/
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'title', value: ['string', draft.title] },
    { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
    { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.salaryUsd).toFixed(2)} USD`] },
    { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.salaryCapacity) * 100)] },
    { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.salaryDeferred))] }
  ]

  if (draft.url) {
    content.push(
      { label: 'url', value: ['string', draft.url] }
    )
  }

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: 'role',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const suspendRole = async function ({ rootState }, { docId, reason }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'suspend',
    data: {
      reason,
      proposer: rootState.accounts.account,
      document_id: docId
    }
  }]

  return this.$api.signTransaction(actions)
}

export const loadRoles = async function ({ commit }, { first, offset }) {
  const query = `
  query roles($first:int, $offset: int) {
    var(func: uid(${this.$config.dho})){
      roles as role @cascade{
        created_date
        content_groups {
          contents  @filter(eq(label,"state") AND NOT eq(value, "suspended")){
            label
            value
          }
        }
      }
    }
    roles(func: uid(roles), orderasc:created_date, first: $first, offset: $offset){
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
  }`
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addRoles', result.data.roles)
  return result.data.roles.length === 0
}

export const loadRole = async function (context, $hash) {
  const query = `
    query role($hash:string){
      role(func: eq(hash, $hash)) {
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
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $hash })
  if (result.data.role.length) {
    return result.data.role[0]
  }
  return null
}

import Turndown from 'turndown'

export const fetchRole = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'role',
    table: 'objects',
    lower_bound: parseInt(id),
    upper_bound: parseInt(id),
    limit: 1
  })

  if (result && result.rows.length) {
    return result.rows[0]
  }
  return null
}

export const saveRoleProposal = async function ({ rootState }, draft) {
  /*
  TODO draft.edit draft.id
  if (edit) {
    actions[0].data.id = id
  }
*/
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'title', value: [ 'string', draft.title ] },
    { label: 'description', value: [ 'string', new Turndown().turndown(draft.description) ] },
    { label: 'annual_usd_salary', value: [ 'asset', `${parseFloat(draft.salaryUsd).toFixed(2)} USD` ] },
    { label: 'fulltime_capacity_x100', value: [ 'int64', Math.round(parseFloat(draft.salaryCapacity) * 100) ] },
    { label: 'min_deferred_x100', value: [ 'int64', Math.round(parseFloat(draft.salaryDeferred)) ] }
  ]

  if (draft.url) {
    content.push(
      { label: 'url', value: [ 'string', draft.url ] }
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

export const suspendRole = async function ({ rootState }, id) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propsuspend',
    data: {
      scope: 'role',
      proposer: rootState.accounts.account,
      id
    }
  }]

  return this.$api.signTransaction(actions)
}

/*
  Dgrapqh
 */

export const loadProposals = async function ({ commit }, { first, offset }) {
  const query = `
  query proposals($first:int, $offset: int) {
    var(func: has(proposal)) {
      proposals as proposal @cascade{
        content_groups {
          contents  @filter(eq(label,"type") and eq(value, "role")){
            label
            value
          }
        }
      }
    }
    proposals(func: uid(proposals), orderdesc:created_date, first: $first, offset: $offset) {
      hash
      creator
      created_date
      content_groups {
        expand(_all_) {
          expand(_all_)
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addProposals', result.data.proposals)
  return result.data.proposals.length === 0
}

export const loadRoles = async function ({ commit }, { first, offset }) {
  const query = `
  query roles($first:int, $offset: int) {
    var(func: has(role)){
      roles as role{}
    }
    roles(func: uid(roles), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        expand(_all_){
          expand(_all_)
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
          expand(_all_){
            expand(_all_)
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

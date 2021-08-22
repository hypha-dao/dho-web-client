export const checkRegistration = async function ({ commit, rootState }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.decide,
    scope: rootState.accounts.account,
    table: 'voters',
    limit: 1000
  })

  if (result && result.rows.length) {
    if (result.rows.some(o => /HVOICE$/.test(o.liquid))) {
      commit('setRegistered', true)
    } else {
      commit('setRegistered', false)
    }
  } else {
    commit('setRegistered', false)
  }
}

export const apply = async function ({ state, rootState, commit }, content) {
  const actions = []

  if (!state.registered) {
    actions.push({
      account: this.$config.contracts.decide,
      name: 'regvoter',
      data: {
        voter: rootState.accounts.account,
        treasury_symbol: '2,HVOICE',
        referrer: null
      }
    })
  }

  actions.push({
    account: this.$config.contracts.dao,
    name: 'apply',
    data: {
      applicant: rootState.accounts.account,
      content
    }
  })

  const result = await this.$api.signTransaction(actions)
  if (result) {
    commit('setRegistered', true)
  }
  return result
}

export const fetchApplication = async function ({ rootState }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'applicants',
    lower_bound: rootState.accounts.account,
    upper_bound: rootState.accounts.account,
    limit: 1
  })

  if (result && result.rows.length && result.rows[0].applicant === rootState.accounts.account) {
    return result.rows[0]
  }
  return null
}

export const loadMembers = async function ({ commit }, { first, offset }) {
  const query = `
  query members($first:int, $offset: int){
    var(func: has(member)){
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

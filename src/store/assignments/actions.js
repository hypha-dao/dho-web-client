import Turndown from 'turndown'

export const fetchAssignment = async function ({ commit, state }, id) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'assignment',
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

export const fetchData = async function ({ commit, state }, username) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'assignment',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })
  if (username && result.rows.length) {
    result.rows = result.rows.filter(r => {
      const data = r.names.find(k => k.key === 'assigned_account')
      return data && data.value === username
    })
  }
  commit('addAssignments', result)
}

export const loadProposals = async function ({ commit }) {
  commit('addProposals', [])
  const query = `
  {
    var(func: has(proposal)) {
      proposals as proposal @cascade{
        content_groups {
          contents  @filter(eq(label,"type") and eq(value, "assignment")){
            label
            value
          }
        }
      }
    }
    proposals(func: uid(proposals)) {
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
  const result = await this.$dgraph.newTxn().query(query)
  commit('addProposals', result.data.proposals)
}

export const saveAssignmentProposal = async function ({ commit, rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'role', value: [ 'checksum256', draft.role.hash ] },
    { label: 'assignee', value: [ 'name', rootState.accounts.account ] },
    { label: 'title', value: [ 'string', draft.title ] },
    { label: 'description', value: [ 'string', new Turndown().turndown(draft.description) ] },
    { label: 'start_period', value: [ 'checksum256', draft.startPeriod.value ] },
    { label: 'period_count', value: [ 'int64', draft.periodCount ] },
    { label: 'time_share_x100', value: [ 'int64', Math.round(parseFloat(draft.salaryCommitted)) ] },
    { label: 'deferred_perc_x100', value: [ 'int64', Math.round(parseFloat(draft.salaryDeferred)) ] }
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
      proposal_type: 'assignment',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const loadAssignments = async function ({ commit }) {
  commit('addAssignments', [])
  const query = `
  {
    var(func: has(assignment)){
      assignments as assignment{}
  }
  assignments(func: uid(assignments)){
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
  const result = await this.$dgraph.newTxn().query(query)
  commit('addAssignments', result.data.assignments)
}

export const getClaimedPeriods = async function (context, assignment) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'asspayouts',
    lower_bound: assignment,
    upper_bound: assignment,
    index_position: 2,
    key_type: 'i64',
    limit: 1000
  })
  if (result && result.rows.length) {
    return result.rows
  }
  return null
}

export const claimAssignmentPayment = async function (context, { assignment, periods }) {
  const actions = []
  periods.forEach(id => {
    actions.push({
      account: this.$config.contracts.dao,
      name: 'payassign',
      data: {
        assignment_id: assignment,
        period_id: id
      }
    })
  })
  return this.$api.signTransaction(actions)
}

export const suspendAssignment = async function ({ rootState }, id) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propsuspend',
    data: {
      scope: 'assignment',
      proposer: rootState.accounts.account,
      id
    }
  }]

  return this.$api.signTransaction(actions)
}

export const withdrawFromAssignment = async function ({ rootState }, { id, notes }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'withdraw',
    data: {
      notes,
      withdrawer: rootState.accounts.account,
      assignment_id: id
    }
  }]

  return this.$api.signTransaction(actions)
}

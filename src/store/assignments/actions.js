import Turndown from 'turndown'

export const loadProposals = async function ({ commit }, { first, offset }) {
  const query = `
  query proposals($first:int, $offset: int) {
    var(func: has(proposal)) {
      proposals as proposal @cascade{
        content_groups {
          contents  @filter(eq(label,"type") and (eq(value, "assignment") or eq(value, "edit"))){
            label
            value
          }
        }
      }
    }
    proposals(func: uid(proposals), orderdesc:created_date, first: $first, offset: $offset) {
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
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addProposals', result.data.proposals)
  return result.data.proposals.length === 0
}

export const saveAssignmentProposal = async function ({ commit, rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'period_count', value: ['int64', draft.periodCount] }
  ]

  if (draft.url) {
    content.push(
      { label: 'url', value: ['string', draft.url] }
    )
  }

  if (!draft.edit) {
    content.push({ label: 'time_share_x100', value: ['int64', Math.round(parseFloat(draft.salaryCommitted))] })
    content.push({ label: 'deferred_perc_x100', value: ['int64', Math.round(parseFloat(draft.salaryDeferred))] })
    content.push({ label: 'role', value: ['checksum256', draft.role.hash] })
    content.push({ label: 'assignee', value: ['name', rootState.accounts.account] })
    content.push({ label: 'start_period', value: ['checksum256', draft.startPeriod.value] })
    content.push({ label: 'title', value: ['string', draft.title] })
    content.push({ label: 'description', value: ['string', new Turndown().turndown(draft.description)] })
  } else {
    content.push({ label: 'original_document', value: ['checksum256', draft.hash] })
    content.push({ label: 'ballot_title', value: ['string', 'Assignment extension'] })
    content.push({ label: 'ballot_description', value: ['string', new Turndown().turndown(draft.description)] })
  }

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: draft.edit ? 'edit' : 'assignment',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const loadAssignments = async function ({ commit }, { first, offset }) {
  const query = `
  query assignments($first:int, $offset: int) {
    var(func: has(assignment)){
      assignments as assignment @cascade{
      content_groups {
          contents  @filter(eq(value,"assignment") and eq(label, "type")){
            label
            value
          }
        }
      }
    }
    assignments(func: uid(assignments), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        expand(_all_){
          expand(_all_)
        }
      }
      lastimeshare {
        content_groups {
          contents {
            label
            type
            value
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addAssignments', result.data.assignments)
  return result.data.assignments.length === 0
}

export const loadUserAssignments = async function ({ commit }, { first, offset, user }) {
  const query = `
  query assignments($first:int, $offset: int, $user: string) {
    var(func: has(assignment)){
      assignedto as assignment @cascade{
        created_date
        content_groups {
          contents  @filter(eq(value,$user) and eq(label, "assignee")){
            label
            value
          }
        }
      }
    }
    assignments as var(func: uid(assignedto))@cascade{
      content_groups {
        contents  @filter(eq(value,"assignment") and eq(label, "type")){
          label
          value
        }
      }
    }
    assignments(func: uid(assignments), orderdesc:created_date, first: $first, offset: $offset){
      hash
      claimed{
        expand(_all_){
          expand(_all_){
            expand(_all_)
          }
        }
      }
      content_groups{
        expand(_all_){
          expand(_all_)
        }
      }
      lastimeshare {
        content_groups {
          contents {
            label
            type
            value
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset, $user: user })
  commit('addAssignments', result.data.assignments)
  return result.data.assignments.length === 0
}

export const claimAssignmentPayment = async function (context, hash) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'claimnextper',
    data: {
      assignment_hash: hash
    }
  }]
  return this.$api.signTransaction(actions)
}

export const adjustCommitment = async function ({ rootState }, { hash, commitment }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustcmtmnt',
    data: {
      issuer: rootState.accounts.account,
      adjust_info: [
        [
          { label: 'assignment', value: ['checksum256', hash] },
          { label: 'new_time_share_x100', value: ['int64', commitment] }
        ]
      ]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const suspendAssignment = async function ({ rootState }, hash) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propsuspend',
    data: {
      scope: 'assignment',
      proposer: rootState.accounts.account,
      id: hash
    }
  }]

  return this.$api.signTransaction(actions)
}

export const withdrawFromAssignment = async function ({ rootState }, { hash, notes }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'withdraw',
    data: {
      notes,
      withdrawer: rootState.accounts.account,
      assignment_id: hash
    }
  }]

  return this.$api.signTransaction(actions)
}

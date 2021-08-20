export const saveBadgeProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'title', value: ['string', draft.title] },
    { label: 'description', value: ['string', draft.description] },
    { label: 'icon', value: ['string', draft.icon] },
    { label: 'max_cycles', value: ['int64', parseInt(draft.maxCycles)] },
    { label: 'start_period', value: ['checksum256', draft.startPeriod.value] },
    { label: 'period_count', value: ['int64', draft.periodCount] }
  ]

  if (draft.seeds) {
    content.push({ label: 'seeds_coefficient_x10000', value: ['int64', parseFloat(draft.seeds) * 100] })
  }
  if (draft.hypha) {
    content.push({ label: 'hypha_coefficient_x10000', value: ['int64', parseFloat(draft.hypha) * 100] })
  }
  if (draft.hvoice) {
    content.push({ label: 'hvoice_coefficient_x10000', value: ['int64', parseFloat(draft.hvoice) * 100] })
  }
  if (draft.husd) {
    content.push({ label: 'husd_coefficient_x10000', value: ['int64', parseFloat(draft.husd) * 100] })
  }

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: 'badge',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const loadProposals = async function ({ commit }, { first, offset }) {
  const query = `
  query proposals($first:int, $offset: int) {
    var(func: has(proposal)) {
      proposals as proposal @cascade{
        content_groups {
          contents  @filter(eq(label,"type") and eq(value, "badge")){
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

export const loadBadgeAssignmentProposals = async function ({ commit }, { first, offset, voter }) {
  const query = `
    query proposals($first:int, $offset: int, $voter: string) {
      var(func: has(proposal)) {
        proposals as proposal @cascade{
          content_groups {
            contents  @filter(eq(label,"type") and eq(value, "assignbadge")){
              label
              value
            }
          }
        }
      }
      var(func: uid(proposals), orderdesc:created_date, first: $first, offset: $offset) {
        voted as vote @cascade{
          hash
          creator
          created_date
          content_groups {
            contents @filter(eq(label,"voter") and eq(value, $voter)){
              label
              value
            }
          }
        }
      }
      proposals(func: uid(proposals), orderdesc:created_date, first: $first, offset: $offset) {
        uid
        hash
        creator
        created_date
        content_groups {
          contents {
            label
            value
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
            }
          }
        }
        vote @filter(uid(voted)){
          hash
          creator
          created_date
          content_groups{
            contents {
              label
              value
            }
          }
        }
      }
    }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset, $voter: voter })
  commit('addProposals', result.data.proposals)
  return result.data.proposals.length === 0
}

export const loadBadges = async function ({ commit }, { first, offset }) {
  const query = `
  query badges($first:int, $offset: int) {
    var(func: has(badge)){
      badges as badge{}
  }
  badges(func: uid(badges), orderdesc:created_date, first: $first, offset: $offset){
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
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addBadges', result.data.badges)
  return result.data.badges.length === 0
}

export const loadBadge = async function (context, $hash) {
  const query = `
    query badge($hash:string){
      badge(func: eq(hash, $hash)) {
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
  if (result.data.badge.length) {
    return result.data.badge[0]
  }
  return null
}

export const saveBadgeAssignmentProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'title', value: ['string', draft.title] },
    { label: 'description', value: ['string', draft.description] },
    { label: 'badge', value: ['checksum256', draft.badge] },
    { label: 'assignee', value: ['name', rootState.accounts.account] },
    { label: 'start_period', value: ['checksum256', draft.startPeriod.value] },
    { label: 'period_count', value: ['int64', draft.periodCount] }
  ]

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: 'assignbadge',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const loadBadgeAssignments = async function ({ commit, rootGetters }) {
  while (rootGetters['badges/badgeAssignmentLoading']) {
    await sleep(200)
  }
  if (rootGetters['badges/badgeAssignments']) {
    // Assignments are already loaded
    return
  }
  commit('setBadgeAssignmentLoading', true)
  const query = `
  {
    var(func: has(assignbadge)){
      assignbadges as assignbadge @cascade{
        created_date
      }
  }
  assignbadges(func: uid(assignbadges)){
    hash
    creator
    created_date
    content_groups{
      expand(_all_){
        expand(_all_)
      }
    }

    badge {
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
}
  `
  const result = await this.$dgraph.newTxn().query(query)
  commit('addBadgeAssignments', result.data.assignbadges)
  commit('setBadgeAssignmentLoading', false)
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

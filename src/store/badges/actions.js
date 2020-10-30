export const saveBadgeProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    {
      label: 'title',
      value: [
        'string',
        draft.title
      ]
    },
    {
      label: 'description',
      value: [
        'string',
        draft.description
      ]
    },
    {
      label: 'icon',
      value: [
        'string',
        draft.icon
      ]
    },
    {
      label: 'max_cycles',
      value: [
        'int64',
        parseInt(draft.maxCycles)
      ]
    }, {
      label: 'start_period',
      value: [
        'int64',
        draft.startPeriod.value
      ]
    }, {
      label: 'end_period',
      value: [
        'int64',
        draft.endPeriod.value
      ]
    }
  ]

  if (draft.seeds) {
    content.push({ label: 'seeds_coefficient_x10000', value: [ 'int64', parseFloat(draft.seeds) * 100 ] })
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

export const loadProposals = async function ({ commit }) {
  commit('addProposals', [])
  const query = `
  {
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

export const loadBadgeAssignmentProposals = async function ({ commit }) {
  commit('addProposals', [])
  const query = `
  {
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

export const loadBadges = async function ({ commit }) {
  commit('addBadges', [])
  const query = `
  {
    var(func: has(badge)){
      badges as badge{}
  }
  badges(func: uid(badges)){
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
  commit('addBadges', result.data.badges)
}

export const saveBadgeAssignmentProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    {
      label: 'title',
      value: [
        'string',
        draft.title
      ]
    },
    {
      label: 'description',
      value: [
        'string',
        draft.description
      ]
    },
    {
      label: 'badge',
      value: [
        'checksum256',
        draft.badge
      ]
    },
    {
      label: 'assignee',
      value: [
        'name',
        rootState.accounts.account
      ]
    }, {
      label: 'start_period',
      value: [
        'int64',
        draft.startPeriod.value
      ]
    }, {
      label: 'end_period',
      value: [
        'int64',
        draft.endPeriod.value
      ]
    }
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

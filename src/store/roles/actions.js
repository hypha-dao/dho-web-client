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

export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'role',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addRoles', result)
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
        new Turndown().turndown(draft.description)
      ]
    },
    {
      label: 'annual_usd_salary',
      value: [
        'asset',
        `${parseFloat(draft.salaryUsd).toFixed(2)} USD`
      ]
    },
    {
      label: 'start_period',
      value: [
        'int64',
        draft.startPeriod.value
      ]
    },
    {
      label: 'end_period',
      value: [
        'int64',
        draft.endPeriod.value
      ]
    },
    {
      label: 'fulltime_capacity_x100',
      value: [
        'int64',
        Math.round(parseFloat(draft.salaryCapacity) * 100)
      ]
    },
    {
      label: 'min_deferred_x100',
      value: [
        'int64',
        Math.round(parseFloat(draft.salaryDeferred))
      ]
    }
  ]

  if (draft.url) {
    content.push(
      {
        label: 'url',
        value: [
          'string',
          draft.url
        ]
      })
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

export const loadProposals = async function ({ commit }) {
  commit('addProposals', [])
  const query = `
  {
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

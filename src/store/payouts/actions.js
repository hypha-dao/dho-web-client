import Turndown from 'turndown'

export const savePayoutProposal = async function ({ rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'recipient', value: [ 'name', rootState.accounts.account ] },
    { label: 'title', value: [ 'string', draft.title ] },
    { label: 'description', value: [ 'string', new Turndown().turndown(draft.description) ] },
    { label: 'start_period', value: [ 'int64', draft.startPeriod.value ] },
    { label: 'end_period', value: [ 'int64', draft.endPeriod.value ] },
    { label: 'seeds_escrow_amount', value: [ 'asset', `${parseFloat(draft.deferredSeeds).toFixed(4)} SEEDS` ] },
    { label: 'hvoice_amount', value: [ 'asset', `${parseFloat(draft.hvoice).toFixed(2)} HVOICE` ] },
    { label: 'hypha_amount', value: [ 'asset', `${parseFloat(draft.hypha).toFixed(2)} HYPHA` ] },
    { label: 'husd_amount', value: [ 'asset', `${parseFloat(draft.husd).toFixed(2)} HUSD` ] }
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
      proposal_type: 'payout',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const fetchData = async function ({ commit, state }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: 'payout',
    table: 'objects',
    lower_bound: state.list.data.length ? state.list.data[state.list.data.length - 1].id : '',
    limit: state.list.pagination.limit,
    reverse: true
  })

  commit('addPayouts', result)
}

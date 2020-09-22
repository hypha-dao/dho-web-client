export const savePayoutProposal = async function ({ commit, rootState }, { title, description, url, recipient, deferredSeeds, hvoice, hypha, husd, startPeriod, endPeriod }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'create',
    data: {
      scope: 'proposal',
      names: [
        { key: 'type', value: 'payout' },
        { key: 'owner', value: rootState.accounts.account },
        { key: 'recipient', value: recipient },
        { key: 'trx_action_name', value: 'makepayout' }
      ],
      strings: [
        { key: 'title', value: title },
        { key: 'description', value: description },
        { key: 'url', value: url }
      ],
      assets: [
        { key: 'seeds_escrow_amount', value: `${parseFloat(deferredSeeds).toFixed(2)} SEEDS` },
        { key: 'hvoice_amount', value: `${parseFloat(hvoice).toFixed(2)} HVOICE` },
        { key: 'hypha_amount', value: `${parseFloat(hypha).toFixed(2)} HYPHA` },
        { key: 'husd_amount', value: `${parseFloat(husd).toFixed(2)} HUSD` }
      ],
      time_points: [],
      ints: [
        { key: 'start_period', value: startPeriod.value },
        { key: 'end_period', value: endPeriod.value }
      ],
      floats: [],
      trxs: []
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

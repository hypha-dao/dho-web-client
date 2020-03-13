export const saveContributionProposal = async function ({ commit, rootState }, { title, description, recipient, amount, deferred, startPeriod, endPeriod }) {
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
        { key: 'description', value: description }
      ],
      assets: [
        { key: 'usd_amount', value: `${parseFloat(amount).toFixed(2)} USD` }
      ],
      time_points: [],
      ints: [
        { key: 'deferred_perc_x100', value: Math.round(parseFloat(deferred) * 100) },
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

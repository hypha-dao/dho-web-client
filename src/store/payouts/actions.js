export const saveProposal = async function ({ commit, rootState }, { title, description, content, recipient, hyphaAmount, seedsAmount, hvoiceAmount, contributedAt, instantPay }) {
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
        { key: 'content', value: content }
      ],
      assets: [
        { key: 'hypha_amount', value: `${parseFloat(hyphaAmount).toFixed(2)} HYPHA` },
        { key: 'seeds_amount', value: `${parseFloat(seedsAmount).toFixed(4)} SEEDS` },
        { key: 'hvoice_amount', value: `${parseFloat(hvoiceAmount).toFixed(2)} HVOICE` }
      ],
      time_points: [{ key: 'contribution_date', value: new Date(contributedAt).toISOString().slice(0, -1) }],
      ints: [
        { key: 'bypass_escrow', value: +instantPay }
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

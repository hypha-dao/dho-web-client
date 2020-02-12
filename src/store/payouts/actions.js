export const saveProposal = async function ({ commit, rootState }, { title, description, content, recipient, hyphaAmount, seedsAmount, hvoiceAmount, contributedAt }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'create',
    data: {
      names: [
        { key: 'proposal_type', value: 'payouts' },
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
      ints: [],
      floats: [],
      trxs: []
    }
  }]

  return this.$api.signTransaction(actions)
}

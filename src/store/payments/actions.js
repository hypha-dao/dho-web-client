export const fetchData = async function ({ commit, state }, { account }) {
  const options = {
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'payments',
    lower_bound: null,
    upper_bound: null,
    limit: 1000
  }
  if (account) {
    options.lower_bound = account
    options.upper_bound = account
    options.index_position = 3
    options.key_type = 'i64'
  }
  const result = await this.$api.getTableRows(options)
  commit('addPayments', result)
}

export const fetchRedemptions = async function ({ commit, state }, { account }) {
  const options = {
    code: this.$config.contracts.treasury,
    scope: this.$config.contracts.treasury,
    table: 'redemptions',
    // lower_bound: account,
    // upper_bound: account,
    // index_position: 3,
    // key_type: 'i64',
    limit: 1000
  }
  // TODO use index
  const result = await this.$api.getTableRows(options)
  if (account && result.rows.length) {
    result.rows = result.rows.filter(r => r.redeemer === account)
  }
  commit('addOpenRedemptions', result)
}

export const redeemToken = async function ({ rootState }, { quantity, memo }) {
  const actions = [
    {
      account: this.$config.contracts.husdToken,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: this.$config.contracts.treasury,
        quantity,
        memo
      }
    },
    {
      account: this.$config.contracts.treasury,
      name: 'redeem',
      data: {
        redeemer: rootState.accounts.account,
        amount: quantity,
        notes: []
      }
    }
  ]
  return this.$api.signTransaction(actions)
}

export const hasRedeemAddress = async function ({ rootState }) {
  const result = await this.$api.getTableRows({
    code: 'kv.hypha',
    scope: 'kv.hypha',
    table: 'kvs',
    index_position: 3,
    key_type: 'i64',
    lower_bound: rootState.accounts.account,
    upper_bound: rootState.accounts.account,
    limit: 1000
  })
  if (result && result.rows.length) {
    const defaultAddr = result.rows.find(r => r.key === 'defaultaddr')
    if (defaultAddr) {
      return result.rows.some(r => r.key === defaultAddr.value)
    }
    return false
  }
  return false
}

export const buySeeds = async function ({ rootState }, quantity) {
  const actions = [
    {
      account: this.$config.contracts.husdToken,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: this.$config.contracts.tlostoSeeds,
        quantity,
        memo: 'DHO Hypha Buy Seeds'
      }
    }
  ]
  return this.$api.signTransaction(actions)
}

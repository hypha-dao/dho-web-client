export const fetchData = async function ({ commit, state }, { account, assignment }) {
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

export const redeemToken = async function ({ rootState }, { quantity, memo }) {
  const actions = [
    {
      account: this.$config.contracts.hyphaToken,
      name: 'transfer',
      data: {
        from: rootState.accounts.account,
        to: 'bank.hypha',
        quantity,
        memo
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
    limit: 100
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

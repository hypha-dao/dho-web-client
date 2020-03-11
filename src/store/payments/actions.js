export const fetchData = async function ({ commit, state }, account) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'payments',
    lower_bound: null,
    upper_bound: null,
    limit: 1000
  })
  if (result.rows && account) {
    result.rows = result.rows.filter(r => r.recipient === account)
  }
  commit('addPayments', result)
}

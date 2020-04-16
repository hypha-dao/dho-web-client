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

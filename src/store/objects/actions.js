export const getObjectByScopeAndId = async function ({ commit }, { scope, id }) {
  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope,
    table: 'objects',
    lower_bound: id,
    upper_bound: id
  })
  if (result.rows && result.rows.length) {
    return result.rows[0]
  }
  return null
}

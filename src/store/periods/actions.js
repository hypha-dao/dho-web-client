export const fetchPeriods = async function ({ commit, state }) {
  if (state.periods.length) return
  let more = true
  while (more) {
    const result = await this.$api.getTableRows({
      code: this.$config.contracts.dao,
      scope: this.$config.contracts.dao,
      table: 'periods',
      lower_bound: state.periods.length ? state.periods[state.periods.length - 1].period_id : '',
      limit: 10000
    })

    commit('addPeriods', result.rows)
    more = result.more
  }
  commit('flushPeriods')
}

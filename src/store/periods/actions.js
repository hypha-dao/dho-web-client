export const fetchPeriods = async function ({ commit, state }) {
  if (state.periods.length) return

  const result = await this.$api.getTableRows({
    code: this.$config.contracts.dao,
    scope: this.$config.contracts.dao,
    table: 'periods',
    lower_bound: state.periods.length ? state.periods[state.periods.length - 1].period_id : '',
    limit: 10000
  })
  const periods = result.rows.map(p => ({
    value: p.id,
    label: `${new Date(p.start_time.slice(0, -4) + 'Z').toDateString()}`,
    phase: p.label,
    startDate: new Date(p.start_time.slice(0, -4) + 'Z'),
    endDate: new Date(p.end_time.slice(0, -4) + 'Z')
  }))
  periods.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  commit('setPeriods', periods)
}

export const getPeriodByDate = ({ state }, date) => {
  return state.periods.find(p => p.endDate.getTime() > date.getTime() && p.startDate.getTime() <= date.getTime())
}

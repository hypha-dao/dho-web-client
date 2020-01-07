export const addPeriods = (state, periods) => {
  const arr = state.periods.length ? periods.slice(1) : periods
  state.periods.push(...arr)
}

export const flushPeriods = (state) => {
  state.periods = [...state.periods]
}

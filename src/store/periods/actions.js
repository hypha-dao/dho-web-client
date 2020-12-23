export const getPeriodByDate = ({ state }, date) => {
  return state.periods.find(p => p.endDate.getTime() > date.getTime() && p.startDate.getTime() <= date.getTime())
}

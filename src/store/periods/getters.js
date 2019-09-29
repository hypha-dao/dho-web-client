export const periods = ({ periods }) => periods
export const periodOptions = ({ periods }) => {
  const options = periods.map(p => ({
    value: p.period_id,
    label: `${new Date(p.start_date).toLocaleDateString()} - ${new Date(p.end_date).toLocaleDateString()}`,
    startDate: p.start_date,
    endDate: p.end_date
  }))
  options.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return options.filter(p => new Date(p.endDate).getTime() > Date.now())
}

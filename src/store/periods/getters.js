export const periods = ({ periods }) => periods

export const periodOptionsStart = ({ periods }) => {
  return periods.filter(p => p.endDate.getTime() > Date.now())
}

export const periodOptionsStartProposal = ({ periods }) => {
  return periods.filter(p => p.endDate.getTime() > Date.now())
}

export const periodOptionsEditProposal = ({ periods }, startDate) => {
  return periods.filter(p => p.endDate.getTime() > startDate.getTime())
}

export const periodOptionsStartContribution = ({ periods }) => {
  const options = periods.map(p => ({
    value: p.period_id,
    label: `${new Date(p.start_date).toDateString()}`,
    phase: p.phase,
    startDate: p.start_date,
    endDate: p.end_date
  }))
  options.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const currentPeriod = options.find(p => new Date(p.endDate).getTime() > Date.now() + new Date().getTimezoneOffset() * 60000)

  // 3 cycles behind
  return options.filter(p => p.value > parseInt(currentPeriod.value - 12))
}

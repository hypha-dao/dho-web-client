export const periods = ({ periods }) => periods

export const periodOptionsStart = ({ periods }) => {
  const options = periods.map(p => ({
    value: p.period_id,
    label: `${new Date(p.start_date).toDateString()}`,
    phase: p.phase,
    startDate: p.start_date,
    endDate: p.end_date
  }))
  options.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return options.filter(p => new Date(p.endDate).getTime() > Date.now())
}

export const periodOptionsStartProposal = ({ periods }) => {
  const options = periods.map(p => ({
    value: p.period_id,
    label: `${new Date(p.start_date).toDateString()}`,
    phase: p.phase,
    startDate: p.start_date,
    endDate: p.end_date
  }))
  options.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return options.filter(p => new Date(p.startDate).getTime() >= Date.now() + 7 * 24 * 60 * 60 * 1000)
}

export const periodOptionsEditProposal = ({ periods }) => {
  const options = periods.map(p => ({
    value: p.period_id,
    label: `${new Date(p.start_date).toDateString()}`,
    phase: p.phase,
    startDate: p.start_date,
    endDate: p.end_date
  }))
  options.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  return options
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
  const currentPeriod = options.find(p => new Date(p.endDate).getTime() > Date.now())

  // 3 cycles behind
  return options.filter(p => p.value > parseInt(currentPeriod.value - 12))
}

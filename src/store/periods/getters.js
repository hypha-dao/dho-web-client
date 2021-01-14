export const periods = ({ periods }) => periods

export const periodOptionsStartProposal = ({ periods }) => {
  return periods.filter(p => p.startDate.getTime() >= Date.now())
}

export const periodOptionsEditProposal = ({ periods }, startDate) => {
  return periods.filter(p => p.startDate.getTime() >= startDate.getTime())
}

export const getEndPeriod = ({ periods }) => ({ value, periodCount }) => {
  const startPhaseIdx = periods.findIndex(p => p.value === value)
  return periods[startPhaseIdx + periodCount]
}

export const getPeriodByDate = ({ periods }) => (date) => {
  return periods.find(p => p.endDate.getTime() > date.getTime() && p.startDate.getTime() <= date.getTime())
}

export const getPeriodIndexByDate = ({ periods }) => (date) => {
  const idx = periods.findIndex(p => p.endDate.getTime() > date.getTime() && p.startDate.getTime() <= date.getTime())
  return idx !== -1 ? idx : periods.length
}

export const getMaxCurrentPeriodCount = ({ periods }) => ({ value, periodCount, maxIdx }) => {
  const startPhaseIdx = periods.findIndex(p => p.value === value)
  let count = 0
  for (let i = startPhaseIdx; i < Math.min(maxIdx, startPhaseIdx + periodCount); i += 1) {
    if (periods.length > i) {
      count += 1
    }
  }
  return count
}

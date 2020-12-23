export const periods = ({ periods }) => periods

export const getPeriodIndex = ({ periods }) => (date) => {
  return periods.findIndex(p => p.startDate.getTime() === date.getTime())
}

export const periodOptionsStart = ({ periods }) => {
  return periods.filter(p => p.startDate.getTime() <= Date.now())
}

export const periodOptionsStartProposal = ({ periods }) => {
  return periods.filter(p => p.startDate.getTime() <= Date.now())
}

export const periodOptionsEditProposal = ({ periods }, startDate) => {
  return periods.filter(p => p.startDate.getTime() <= startDate.getTime())
}

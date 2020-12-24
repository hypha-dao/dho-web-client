export const periods = ({ periods }) => periods

export const periodOptionsStartProposal = ({ periods }) => {
  return periods.filter(p => p.startDate.getTime() >= Date.now())
}

export const periodOptionsEditProposal = ({ periods }, startDate) => {
  return periods.filter(p => p.startDate.getTime() >= startDate.getTime())
}

export const proposals = ({ list }) => {
  const data = []
  data.push(...list.assignments.data)
  data.push(...list.payouts.data)
  data.push(...list.roles.data)
  data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
  return data
}
export const proposalsLoaded = ({ list }) => list.loaded

export const role = ({ view }) => view.role
export const roles = ({ roles }) => roles.items
export const rolesLoaded = ({ roles }) => roles.loaded

export const activeRoleProposals = ({ roleProposals }, getter, rootState) => {
  return roleProposals.items.filter(r => {
    const ballot = rootState.trail.ballots.find(b => b.ballot_id === r.ballot_id)
    if (ballot && ballot.end_time * 1000 > new Date().getTime()) {
      return r
    }
  })
}

export const historyRoleProposals = ({ roleProposals }, getter, rootState) => {
  return roleProposals.items.filter(r => {
    const ballot = rootState.trail.ballots.find(b => b.ballot_id === r.ballot_id)
    if (ballot && ballot.end_time * 1000 < new Date().getTime()) {
      return r
    }
  })
}
export const roleProposalsLoaded = ({ roleProposals }) => roleProposals.loaded

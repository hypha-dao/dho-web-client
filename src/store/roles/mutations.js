export const addRole = (state, role) => {
  state.view.role = role
}

export const addRoles = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.roles.items.length ? rows.slice(1) : rows
    state.roles.items = state.roles.items.concat(arr)
  }
  state.roles.loaded = !more
}

export const addRoleProposals = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.roleProposals.items.length ? rows.slice(1) : rows
    state.roleProposals.items = state.roleProposals.items.concat(arr)
  }
  state.roleProposals.loaded = !more
}

export const loadNewProposals = (state) => {
  state.roleProposals.loaded = false
}

export const setActiveRoles = (state, { rows }) => {
  state.activeRoles = rows
}

export const setProposalRoles = (state, { rows }) => {
  state.proposalRoles = rows.reverse()
}

export const setProposalStats = (state, { rows }) => {
  state.proposalRoles = state.proposalRoles.map(proposalData => {
    const proposalStats = rows.find(item => item.prop_id === proposalData.ballot_id - 5)

    delete proposalData.status

    return {
      ...proposalData,
      ...proposalStats,
      closed: new Date() > new Date(proposalStats.end_time * 1000)
    }
  })
}

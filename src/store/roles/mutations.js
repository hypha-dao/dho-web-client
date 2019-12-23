export const addRole = (state, role) => {
  state.view.role = role
}

export const addRoles = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.list.data.length ? rows.slice(1) : rows
    state.list.data = state.list.data.concat(arr)
  }
  state.list.loaded = !more
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

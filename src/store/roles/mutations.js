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

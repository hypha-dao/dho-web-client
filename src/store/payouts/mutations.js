export const setActiveItems = (state, { rows }) => {
  state.activeItems = rows
}

export const setProposalItems = (state, { rows }) => {
  state.proposalItems = rows
}

export const setProposalStats = (state, { rows }) => {
  state.proposalItems = state.proposalItems.map(proposalData => {
    const proposalStats = rows.find(item => item.prop_id === proposalData.ballot_id - 5)

    delete proposalData.status

    return {
      ...proposalData,
      ...proposalStats
    }
  })
}

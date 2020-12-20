export const addProposals = (state, proposals) => {
  state.proposals = proposals
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}

export const addAssignments = (state, assignments) => {
  state.assignments = assignments
}

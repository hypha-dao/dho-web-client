export const clearProposals = (state) => {
  state.proposals = []
}

export const addProposals = (state, proposals) => {
  state.proposals = [...state.proposals, ...proposals]
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}
export const clearAssignments = (state) => {
  state.assignments = []
}

export const addAssignments = (state, assignments) => {
  state.assignments = [...state.assignments, ...assignments]
}

export const addUserAssignments = (state, assignments) => {
  state.userAssignments = assignments
}

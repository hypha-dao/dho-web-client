export const clearRoles = (state) => {
  state.roles = []
}

export const addRoles = (state, roles) => {
  state.roles = [...state.roles, ...roles]
}

export const clearProposals = (state) => {
  state.proposals = []
}

export const addProposals = (state, proposals) => {
  state.proposals = [...state.proposals, ...proposals]
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}

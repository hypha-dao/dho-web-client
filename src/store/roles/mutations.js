export const addRoles = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.list.data.length ? rows.slice(1) : rows
    state.list.data = state.list.data.concat(arr)
  }
  state.list.loaded = !more
}

export const clearData = (state) => {
  state.list.data = []
  state.list.loaded = false
}

export const addProposals = (state, proposals) => {
  state.proposals = proposals
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}

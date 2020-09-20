export const addProposals = (state, { rows, more }) => {
  state.list.data = [...state.list.data].concat(rows)
  state.list.loaded = !more
}

export const clearData = (state) => {
  state.list.data = []
  state.list.loaded = false
}

export const removeProposal = (state, id) => {
  state.list.data = state.list.data.filter(o => o.id !== id)
}

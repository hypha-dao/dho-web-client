export const addProposals = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.list.data.length ? rows.slice(1) : rows
    // Exclude the assignments from the list. it's done here to avoid breaking the pagination
    state.list.data = state.list.data.concat(arr.filter(o => o.names.find(o => o.key === 'proposal_type').value !== 'assignments'))
  }
  state.list.loaded = !more
}

export const clearData = (state) => {
  state.list.data = []
  state.list.loaded = false
}

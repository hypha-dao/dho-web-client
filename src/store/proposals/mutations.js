export const addProposals = (state, { rows, more }) => {
  if (rows) {
    // Remove the first item as it's the lower_bound
    const arr = state.list.data.length ? rows.slice(1) : rows
    state.list.data = state.list.data.concat(arr)
  }
  state.list.loaded = !more
}

export const clearData = (state) => {
  state = {
    ...state,
    list: {
      assignments: { data: [], loaded: false },
      payouts: { data: [], loaded: false },
      roles: { data: [], loaded: false },
      data: [],
      loaded: false
    }
  }
}

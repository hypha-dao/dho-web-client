export const addAssignment = (state, assignment) => {
  state.view = assignment
}

export const addAssignments = (state, { assignments, proposals }) => {
  if (assignments) {
    if (assignments.rows) {
      // Remove the first item as it's the lower_bound
      const arr = state.list.assignments.data.length ? assignments.rows.slice(1) : assignments.rows
      state.list.assignments.data = state.list.assignments.data.concat(arr)
    }
    state.list.assignments.loaded = !assignments.more
  }
  if (proposals) {
    if (proposals.rows) {
      // Remove the first item as it's the lower_bound
      const arr = state.list.proposals.data.length ? proposals.rows.slice(1) : proposals.rows
      state.list.proposals.data = state.list.proposals.data.concat(arr)
    }
    state.list.proposals.loaded = !proposals.more
  }

  const data = []
  data.push(...state.list.assignments.data)
  data.push(...state.list.proposals.data)
  data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
  state.list.data = data
  state.list.loaded = state.list.assignments.loaded && state.list.proposals.loaded
}

export const clearData = (state) => {
  state.list.data = []
  state.list.loaded = false
  state.list.assignments.data = []
  state.list.assignments.loaded = false
  state.list.proposals.data = []
  state.list.proposals.loaded = false
}

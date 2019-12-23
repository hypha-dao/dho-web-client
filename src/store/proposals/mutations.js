export const addProposals = (state, { assignments, payouts, roles }) => {
  if (assignments) {
    if (assignments.rows) {
      // Remove the first item as it's the lower_bound
      const arr = state.list.assignments.data.length ? assignments.rows.slice(1) : assignments.rows
      state.list.assignments.data = state.list.assignments.data.concat(arr)
    }
    state.list.assignments.loaded = !assignments.more
  }

  if (payouts) {
    if (payouts.rows) {
      // Remove the first item as it's the lower_bound
      const arr = state.list.payouts.data.length ? payouts.rows.slice(1) : payouts.rows
      state.list.payouts.data = state.list.payouts.data.concat(arr)
    }
    state.list.payouts.loaded = !assignments.more
  }

  if (roles) {
    if (roles.rows) {
      // Remove the first item as it's the lower_bound
      const arr = state.list.roles.data.length ? roles.rows.slice(1) : roles.rows
      state.list.roles.data = state.list.roles.data.concat(arr)
    }
    state.list.roles.loaded = !assignments.more
  }
  state.list.loaded = state.list.assignments.loaded && state.list.payouts.loaded && state.list.roles.loaded
}

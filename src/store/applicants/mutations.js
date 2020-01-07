export const addApplicants = (state, { rows, more }) => {
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

export const removeApplicant = (state, applicant) => {
  state.list.data = state.list.data.filter(a => a.applicant !== applicant)
}

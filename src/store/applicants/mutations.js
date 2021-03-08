export const addApplicants = (state, applicants) => {
  state.applicants = [...state.applicants, ...applicants]
}

export const clearData = (state) => {
  state.applicants = []
}

export const removeApplicant = (state, hash) => {
  state.applicants = state.applicants.filter(a => a.hash !== hash)
}

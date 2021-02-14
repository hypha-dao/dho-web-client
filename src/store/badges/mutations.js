export const clearProposals = (state) => {
  state.proposals = []
}

export const addProposals = (state, proposals) => {
  state.proposals = [...state.proposals, ...proposals]
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}

export const clearBadges = (state) => {
  state.badges = []
}

export const addBadges = (state, badges) => {
  state.badges = [...state.badges, ...badges]
}

export const setBadgeAssignmentLoading = (state, status) => {
  state.badgeAssignmentLoading = status
}

export const addBadgeAssignments = (state, badgeAssignments) => {
  const data = {}
  for (const assignment of badgeAssignments) {
    if (!data[assignment.creator]) {
      data[assignment.creator] = []
    }
    data[assignment.creator].push(assignment)
  }
  state.badgeAssignments = data
}

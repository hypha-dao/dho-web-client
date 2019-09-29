export const addBallots = (state, ballots) => {
  for (const ballot of ballots) {
    if (!state.ballots.some(b => b.ballot_id === ballot.ballot_id)) {
      state.ballots.push(ballot)
    }
  }
}

export const addProposals = (state, proposals) => {
  for (const proposal of proposals) {
    const idx = state.ballots.findIndex(b => b.reference_id === proposal.prop_id)
    const ballot = state.ballots[idx]
    state.ballots[idx] = {
      ...ballot,
      ...proposal
    } // This updates the object to avoid multiple rpc query, instead of the traditional [...slice(0, idx), obj, ...slice(idx +1)]
  }
}

// triggers the rendering of ballots time, needed because of the hack of addProposals
export const flushProposals = (state) => {
  state.ballots = [...state.ballots]
}

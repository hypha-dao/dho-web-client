export const addBallot = (state, { id, ballot }) => {
  state.ballots = {
    ...state.ballots,
    [id]: {
      ...ballot,
      userVote: null
    }
  }
}

export const setUserVote = (state, { id, vote }) => {
  state.ballots[id].userVote = vote
}

export const setSupplyLoading = (state, status) => {
  state.supplyLoading = status
}

export const setSupply = (state, supply) => {
  state.supply = parseFloat(supply)
}

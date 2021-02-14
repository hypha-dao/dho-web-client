export const setSeedsValues = (state, { usdToSeeds, seedsToUsd }) => {
  state.usdToSeeds = usdToSeeds
  state.seedsToUsd = seedsToUsd
}

export const clearPayouts = (state) => {
  state.payouts = []
}

export const addPayouts = (state, payouts) => {
  state.payouts = [...state.payouts, ...payouts]
}

export const clearProposals = (state) => {
  state.proposals = []
}

export const addProposals = (state, proposals) => {
  state.proposals = [...state.proposals, ...proposals]
}

export const removeProposal = (state, hash) => {
  state.proposals = state.proposals.filter(p => p.hash !== hash)
}

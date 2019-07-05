import wallet from '../../wallet'

export default {
  namespaced: true,
  state: {
    stewards: [],
    nominees: []
  },
  actions: {
    loadBoardMembers: ({ commit }, payload) => {
      const contract = wallet.getContractAccount()

      wallet.getTableRows(contract, contract, 'stewards')
        .then(result => {
          commit('setActiveItems', result)
        })
    },
    loadNominees: ({ commit }, payload) => {
      const contract = wallet.getContractAccount()

      wallet.getTableRows(contract, contract, 'nominees')
        .then(result => {
          commit('setProposalItems', result)
        })
    }
  },
  mutations: {
    setActiveItems: (state, { rows }) => {
      state.activeItems = rows
    },
    setProposalItems: (state, { rows }) => {
      state.proposalItems = rows
    }
  }
}

import wallet from 'src/wallet'

export const loadBoardMembers = ({ commit }, payload) => {
  const contract = wallet.getContractAccount()

  wallet.getTableRows(contract, contract, 'stewards')
    .then(result => {
      commit('setActiveItems', result)
    })
}

export const loadNominees = ({ commit }, payload) => {
  const contract = wallet.getContractAccount()

  wallet.getTableRows(contract, contract, 'nominees')
    .then(result => {
      commit('setProposalItems', result)
    })
}

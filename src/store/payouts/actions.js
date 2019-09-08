import wallet from 'src/wallet'

export const loadActive = ({ commit }) => {
  const contract = wallet.getContractAccount()

  wallet.getTableRows(contract, contract, 'payments')
    .then(result => {
      commit('setActiveItems', result)
    })
}

export const loadProposals = ({ commit }) => {
  const contract = wallet.getContractAccount()

  wallet.getTableRows(contract, contract, 'payoutprops')
    .then(result => {
      commit('setProposalItems', result)

      return wallet.getTableRows(wallet.getTrailAccount(), wallet.getTrailAccount(), 'proposals')
        .then(result => {
          commit('setProposalStats', result)
        })
    })
}

export const sendProposal = ({ dispatch }, payload) => {
  const contract = wallet.getContractAccount()
  const user = wallet.getUserAccount()

  const transaction = {
    actions: [{
      account: contract,
      name: 'proppayout',
      authorization: [{
        actor: user,
        permission: 'active'
      }],
      data: {
        proposer: user,
        recipient: user,
        notes: payload.notes,
        info_url: payload.info_url,
        hypha_value: Number.parseFloat(payload.hypha_salary || 0).toFixed(4).concat(' HYPHA'),
        preseeds_value: Number.parseFloat(payload.preseeds_salary || 0).toFixed(4).concat(' SEEDS'),
        voice_value: Number.parseFloat(payload.voice_salary || 0).toFixed(4).concat(' HVOICE'),
        contribution_date: new Date(payload.contribution_date).toISOString().slice(0, -1)
      }
    }]
  }

  dispatch('wallet/sendTransaction', {
    name: 'Propose New Payout',
    transaction
  }, { root: true })
}

export const sendVote = ({ dispatch }, payload) => {
  const trail = wallet.getTrailAccount()
  const user = wallet.getUserAccount()

  const transaction = {
    actions: [{
      account: trail,
      name: 'castvote',
      authorization: [{
        actor: user,
        permission: 'active'
      }],
      data: {
        voter: user,
        ballot_id: payload.ballot_id,
        direction: payload.direction
      }
    }]
  }

  dispatch('wallet/sendTransaction', {
    name: 'Vote for Payout',
    transaction
  }, { root: true })
}

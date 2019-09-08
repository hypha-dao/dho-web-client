import wallet from 'src/wallet'

export const loadActive = ({ commit }) => {
  wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'roles')
    .then(result => {
      commit('setActiveRoles', result)
    })
}

export const loadProposals = ({ commit, dispatch }) => {
  wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'roleprops')
    .then(result => {
      commit('setProposalRoles', result)

      return wallet.getTableRows(wallet.getTrailAccount(), wallet.getTrailAccount(), 'proposals')
        .then(result => {
          commit('setProposalStats', result)
        })
    })
}

export const sendProposal = ({ dispatch }, payload) => {
  const transaction = {
    actions: [{
      account: wallet.getContractAccount(),
      name: 'proposerole',
      authorization: [{
        actor: wallet.getUserAccount(),
        permission: 'active'
      }],
      data: {
        proposer: wallet.getUserAccount(),
        role_name: payload.role_name,
        description: payload.description,
        info_url: payload.info_url || '',
        hypha_salary: Number.parseFloat(payload.hypha_salary || 0).toFixed(4).concat(' HYPHA'),
        preseeds_salary: Number.parseFloat(payload.preseeds_salary || 0).toFixed(4).concat(' SEEDS'),
        voice_salary: Number.parseFloat(payload.voice_salary || 0).toFixed(4).concat(' HVOICE'),
        start_period: new Date(payload.start_period).getTime() / 1000,
        end_period: new Date(payload.end_period).getTime() / 1000
      }
    }]
  }

  dispatch('wallet/sendTransaction', {
    name: 'Propose New Role',
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
    name: 'Vote for Role',
    transaction
  }, { root: true })
}

import wallet from '../../wallet'

export default {
  namespaced: true,
  state: {
    activeRoles: [],
    proposalRoles: []
  },
  getters: {
    activeRoles: (state) => state.roles.activeRoles,
    proposalRoles: (state) => state.roles.proposalRoles
  },
  actions: {
    loadActive: ({ commit }) => {
      wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'roles')
        .then(result => {
          console.log({ result })
          commit('setActiveRoles', result)
        })
    },
    loadProposals: ({ commit }) => {
      wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'roleprops')
        .then(result => {
          commit('setProposalRoles', result)
        })
    },
    sendProposal: ({ dispatch }, payload) => {
      dispatch('wallet/startTransaction', 'Propose New Role', { root: true })

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
            voice_salary: Number.parseFloat(payload.voice_salary || 0).toFixed(4).concat(' HVOICE')
          }
        }]
      }

      wallet.transact(transaction).then(result => {
        dispatch('wallet/finishTransaction', result.transaction_hash, { root: true })
      })
    },
    sendVote: ({ dispatch }, payload) => {
      dispatch('wallet/startTransaction', 'Vote for Role', { root: true })

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

      wallet.transact(transaction).then(result => {
        console.log({ result })
        dispatch('wallet/finishTransaction', result.transaction_id, { root: true })
      })
    }
  },
  mutations: {
    setActiveRoles: (state, { rows }) => {
      state.activeRoles = rows
    },
    setProposalRoles: (state, { rows }) => {
      state.proposalRoles = rows
    }
  }
}

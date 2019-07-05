import wallet from '../../wallet'

export default {
  namespaced: true,
  state: {
    activeAssignments: [],
    proposalAssignments: []
  },
  getters: {
    activeAssignments: (state) => state.assignments.activeAssignments,
    proposalAssignments: (state) => state.assignments.proposalAssignments
  },
  actions: {
    loadActive: ({ commit }) => {
      wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'assignments')
        .then(result => {
          commit('setActiveAssignments', result)
        })
    },
    loadProposals: ({ commit }) => {
      wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'assprops')
        .then(result => {
          commit('setProposalAssignments', result)
        })
    },
    sendProposal: ({ dispatch }, payload) => {
      dispatch('wallet/startTransaction', 'Propose New Assignment', { root: true })

      const transaction = {
        actions: [{
          account: wallet.getContractAccount(),
          name: 'propassign',
          authorization: [{
            actor: wallet.getUserAccount(),
            permission: 'active'
          }],
          data: {
            proposer: wallet.getUserAccount(),
            assigned_account: wallet.getUserAccount(),
            role_name: payload.role_name,
            info_url: payload.info_url,
            notes: payload.notes,
            start_period: new Date(payload.start_period).getTime() / 1000 || 0,
            time_share: payload.time_share
          }
        }]
      }

      wallet.transact(transaction).then(result => {
        dispatch('wallet/finishTransaction', result.transaction_hash, { root: true })
      })
    },
    sendVote: ({ dispatch }, payload) => {
      dispatch('wallet/startTransaction', 'Vote for Assignment', { root: true })

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
        dispatch('wallet/finishTransaction', result.transaction_id, { root: true })
      })
    }
  },
  mutations: {
    setActiveAssignments: (state, { rows }) => {
      state.activeAssignments = rows
    },
    setProposalAssignments: (state, { rows }) => {
      state.proposalAssignments = rows
    }
  }
}

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
    sendProposal: ({ commit }, payload) => {
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

      wallet.transact(transaction)
    },
    sendVote: ({ commit }, payload) => {
      console.log('send assignment vote', payload)
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

import wallet from 'src/wallet'

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
          commit('setActiveRoles', result)
        })
    },
    loadProposals: ({ commit, dispatch }) => {
      wallet.getTableRows(wallet.getContractAccount(), wallet.getContractAccount(), 'roleprops')
        .then(result => {
          commit('setProposalRoles', result)

          return wallet.getTableRows(wallet.getTrailAccount(), wallet.getTrailAccount(), 'proposals')
            .then(result => {
              commit('setProposalStats', result)
            })
        })
    },
    sendProposal: ({ dispatch }, payload) => {
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
            start_period: +new Date(payload.start_period),
            end_period: +new Date(payload.start_period) + (2 * 7 * 24 * 60 * 60)
          }
        }]
      }

      dispatch('wallet/sendTransaction', {
        name: 'Propose New Role',
        transaction
      }, { root: true })
    },
    sendVote: ({ dispatch }, payload) => {
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
  },
  mutations: {
    setActiveRoles: (state, { rows }) => {
      state.activeRoles = rows
    },
    setProposalRoles: (state, { rows }) => {
      state.proposalRoles = rows.reverse()
    },
    setProposalStats: (state, { rows }) => {
      state.proposalRoles = state.proposalRoles.map(proposalData => {
        const proposalStats = rows.find(item => item.prop_id === proposalData.ballot_id - 5)

        delete proposalData.status

        return {
          ...proposalData,
          ...proposalStats
        }
      })
    }
  }
}

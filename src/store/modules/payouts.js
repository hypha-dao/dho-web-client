import wallet from 'src/wallet'

export default {
  namespaced: true,
  state: {
    activeItems: [],
    proposalItems: []
  },
  getters: {
    activeItems: (state) => state.payouts.activeItems,
    proposalItems: (state) => state.payouts.proposalItems
  },
  actions: {
    loadActive: ({ commit }) => {
      const contract = wallet.getContractAccount()

      wallet.getTableRows(contract, contract, 'payments')
        .then(result => {
          commit('setActiveItems', result)
        })
    },
    loadProposals: ({ commit }) => {
      const contract = wallet.getContractAccount()

      wallet.getTableRows(contract, contract, 'payoutprops')
        .then(result => {
          commit('setProposalItems', result)
        })
    },
    sendProposal: ({ dispatch }, payload) => {
      const contract = wallet.getContractAccount()
      const user = wallet.getUserAccount()

      console.log({ contribution_date: new Date(payload.contribution_date) })

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
            contribution_date: new Date(payload.contribution_date).toISOString()
          }
        }]
      }

      dispatch('wallet/sendTransaction', {
        name: 'Propose New Payout',
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
        name: 'Vote for Payout',
        transaction
      }, { root: true })
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

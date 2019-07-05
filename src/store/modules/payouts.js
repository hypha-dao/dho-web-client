import wallet from '../../wallet'

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
      dispatch('wallet/startTransaction', 'Propose New Payout', { root: true })

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
            hypha_salary: Number.parseFloat(payload.hypha_salary || 0).toFixed(4).concat(' HYPHA'),
            preseeds_salary: Number.parseFloat(payload.preseeds_salary || 0).toFixed(4).concat(' SEEDS'),
            voice_salary: Number.parseFloat(payload.voice_salary || 0).toFixed(4).concat(' HVOICE'),
            contribution_date: new Date(payload.contribution_date).getTime / 1000 || 0
          }
        }]
      }

      wallet.transact(transaction).then(result => {
        dispatch('wallet/finishTransaction', result.transaction_hash, { root: true })
      })
    },
    sendVote: ({ dispatch }, payload) => {
      dispatch('wallet/startTransaction', 'Vote for Payout', { root: true })

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
    setActiveItems: (state, { rows }) => {
      state.activeItems = rows
    },
    setProposalItems: (state, { rows }) => {
      state.proposalItems = rows
    }
  }
}

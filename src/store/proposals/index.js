import Turndown from 'turndown'

/**
 * This vuex data store contains the data needed in the proposal creation wizard.
 */
export default {
  namespaced: true,
  state: {
    draft: {
      type: 'Payout',
      category: {},
      title: '',
      description: '',
      url: '',

      // For payouts
      usdAmount: 0,
      deferred: 0, // Also used for assignments
      peg: 0,
      reward: 0,
      voice: 0,

      // For assignments
      commitment: 0,
      role: null,
      startPeriod: null,

      // For roles/archetypes
      annualUsdSalary: 0,
      roleCapacity: 0,
      minDeferred: 0
    }
  },

  getters: {},

  mutations: {
    reset (state) {
      state.draft.type = 'Payout'
      state.draft.category = {}
      state.draft.title = ''
      state.draft.description = ''
      state.draft.url = ''
      state.draft.usdAmount = 0
      state.draft.deferred = 0
      state.draft.peg = 0
      state.draft.reward = 0
      state.draft.voice = 0
      state.draft.commitment = 0
      state.draft.role = null
      state.draft.startPeriod = null
      state.draft.annualUsdSalary = 0
      state.draft.roleCapacity = 0
      state.draft.minDeferred = 0
    },

    setDraft (state, draft) {
      state.draft = { ...draft }
    },

    setType (state, type) {
      state.draft.type = type
      state.draft.usdAmount = 0
      state.draft.deferred = 0
      state.draft.peg = 0
      state.draft.reward = 0
      state.draft.voice = 0
      state.draft.annualUsdSalary = 0
      state.draft.roleCapacity = 0
      state.draft.minDeferred = 0
    },

    setCategory (state, category) {
      state.draft.category = { ...category }
    },

    setTitle (state, title) {
      state.draft.title = title
    },

    setDescription (state, description) {
      state.draft.description = description
    },

    setUrl (state, url) {
      state.draft.url = url
    },

    setUsdAmount (state, amount) {
      state.draft.usdAmount = amount
    },

    setDeferred (state, deferred) {
      state.draft.deferred = deferred
    },

    setPeg (state, peg) {
      state.draft.peg = peg
    },

    setReward (state, reward) {
      state.draft.reward = reward
    },

    setVoice (state, voice) {
      state.draft.voice = voice
    },

    setCommitment (state, commitment) {
      state.draft.commitment = commitment
    },

    setRole (state, role) {
      state.draft.role = role
    },

    setStartPeriod (state, startPeriod) {
      state.draft.startPeriod = startPeriod
    },

    setAnnualUsdSalary (state, annualUsdSalary) {
      state.draft.annualUsdSalary = annualUsdSalary
    },

    setRoleCapacity (state, roleCapacity) {
      state.draft.roleCapacity = roleCapacity
    },

    setMinDeferred (state, minDeferred) {
      state.draft.minDeferred = Math.max(0, Math.min(minDeferred, 100))
    }
  },

  actions: {
    calculateTokens ({ commit, state, rootState }) {
      const deferredSan = isNaN(state.draft.deferred) ? 0 : parseFloat(state.draft.deferred || 0)
      const ratioUsdEquity = parseFloat(state.draft.usdAmount || 0)

      commit('setPeg', (ratioUsdEquity * (1 - deferredSan * 0.01)))
      commit('setReward', (ratioUsdEquity * deferredSan * 0.01 / rootState.dao.settings.rewardToPegRatio))
      commit('setVoice', ratioUsdEquity)
    },

    saveDraft ({ commit, state }) {
      localStorage.setItem('proposal-draft', JSON.stringify(state.draft))
      // commit('reset', true)
    },

    continueDraft ({ commit }, draft) {
      commit('setDraft', draft)
    },

    async publishProposal ({ state, rootState }) {
      const draft = state.draft

      switch (draft.type) {
        case 'Payout': {
          const content = [
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'recipient', value: ['name', rootState.accounts.account] },
            { label: 'title', value: ['string', draft.title] },
            { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
            { label: 'url', value: ['string', draft.url] },
            { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(2)} ${rootState.dao.settings.voiceToken}`] },
            { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(2)} ${rootState.dao.settings.rewardToken}`] },
            { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(2)} ${rootState.dao.settings.pegToken}`] }
          ]

          const actions = [{
            account: this.$config.contracts.dao,
            name: 'propose',
            data: {
              dao_hash: rootState.dao.hash,
              proposer: rootState.accounts.account,
              proposal_type: 'payout',
              content_groups: [content],
              publish: true
            }
          }]

          return this.$api.signTransaction(actions)
        }

        case 'Assignment': {
          const content = [
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'assignee', value: ['name', rootState.accounts.account] },
            { label: 'title', value: ['string', draft.title] },
            { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
            { label: 'url', value: ['string', draft.url] },

            { label: 'time_share_x100', value: ['int64', draft.commitment] },
            { label: 'deferred_perc_x100', value: ['int64', draft.deferred] },
            { label: 'role', value: ['checksum256', draft.role] },
            { label: 'start_period', value: ['checksum256', draft.startPeriod] },
            { label: 'period_count', value: ['int64', draft.periodCount] }
          ]

          const actions = [{
            account: this.$config.contracts.dao,
            name: 'propose',
            data: {
              dao_hash: rootState.dao.hash,
              proposer: rootState.accounts.account,
              proposal_type: 'assignment',
              content_groups: [content],
              publish: true
            }
          }]
          return this.$api.signTransaction(actions)
        }

        case 'Role': {
          const content = [
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'title', value: ['string', draft.title] },
            { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
            { label: 'url', value: ['string', draft.url] },
            { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
            { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.roleCapacity) * 100)] },
            { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.minDeferred))] }
          ]

          const actions = [{
            account: this.$config.contracts.dao,
            name: 'propose',
            data: {
              dao_hash: rootState.dao.hash,
              proposer: rootState.accounts.account,
              proposal_type: 'role',
              content_groups: [content]
            }
          }]
          return this.$api.signTransaction(actions)
        }
      }
    }
  }
}

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
      badge: null,
      startPeriod: null,
      periodCount: null,
      detailsPeriod: null,
      startDate: null,

      // For roles/archetypes
      annualUsdSalary: 0,
      roleCapacity: 0,
      minDeferred: 0,

      // For Organization/Badges
      icon: null,
      rewardCoefficient: {
        label: null,
        value: null
      },
      voiceCoefficient: {
        label: null,
        value: null
      },
      pegCoefficient: {
        label: null,
        value: null
      },
      badgeRestriction: null,
      next: false
    }
  },

  getters: {
  },

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
      state.draft.badge = null
      state.draft.startPeriod = null
      state.draft.annualUsdSalary = 0
      state.draft.roleCapacity = 0
      state.draft.minDeferred = 0
      state.draft.icon = null
      state.draft.next = false
    },

    restoreDraftDetails (state) {
      state.draft.title = ''
      state.draft.description = ''
      state.draft.url = ''

      // For payouts
      state.draft.usdAmount = 0
      state.draft.deferred = 0 // Also used for assignments
      state.draft.peg = 0
      state.draft.reward = 0
      state.draft.voice = 0

      // For assignments
      state.draft.commitment = 0
      state.draft.role = null
      state.draft.startPeriod = null
      state.draft.periodCount = null
      state.draft.detailsPeriod = null
      state.draft.startDate = null

      // For roles/archetypes
      state.draft.annualUsdSalary = 0
      state.draft.roleCapacity = 0
      state.draft.minDeferred = 0

      // For Organization/Badges
      state.draft.icon = null
      state.draft.rewardCoefficient = {
        label: null,
        value: null
      }
      state.draft.voiceCoefficient = {
        label: null,
        value: null
      }
      state.draft.pegCoefficient = {
        label: null,
        value: null
      }
      state.draft.badgeRestriction = null
      state.draft.next = false
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

    setBadge (state, badge) {
      state.draft.badge = badge
    },

    setStartPeriod (state, startPeriod) {
      state.draft.startPeriod = startPeriod
    },

    setPeriodCount (state, periodCount) {
      state.draft.periodCount = periodCount
    },

    setDetailsPeriod (state, detailsPeriod) {
      state.draft.detailsPeriod = detailsPeriod
    },

    setAnnualUsdSalary (state, annualUsdSalary) {
      state.draft.annualUsdSalary = annualUsdSalary
    },

    setRoleCapacity (state, roleCapacity) {
      state.draft.roleCapacity = roleCapacity
    },

    setMinDeferred (state, minDeferred) {
      state.draft.minDeferred = Math.max(0, Math.min(minDeferred, 100))
    },

    setIcon (state, icon) {
      state.draft.icon = icon
    },

    setRewardCoefficientLabel (state, rewardCoefficient) {
      state.draft.rewardCoefficient.label = rewardCoefficient
    },

    setVoiceCoefficientLabel (state, voiceCoefficient) {
      state.draft.voiceCoefficient.label = voiceCoefficient
    },

    setPegCoefficientLabel (state, pegCoefficient) {
      state.draft.pegCoefficient.label = pegCoefficient
    },

    setRewardCoefficient (state, rewardCoefficient) {
      state.draft.rewardCoefficient.value = rewardCoefficient
    },

    setVoiceCoefficient (state, voiceCoefficient) {
      state.draft.voiceCoefficient.value = voiceCoefficient
    },

    setPegCoefficient (state, pegCoefficient) {
      state.draft.pegCoefficient.value = pegCoefficient
    },

    setStartDate (state, startDate) {
      state.draft.startDate = startDate
    },

    setBadgeRestriction (state, badgeRestriction) {
      state.draft.badgeRestriction = badgeRestriction
    },

    setNext (state, next) {
      state.draft.next = next
    }

  },

  actions: {
    calculateTokens ({ commit, state, rootState }) {
      const typeProposal = state.draft.category.key
      let deferredSan = isNaN(state.draft.deferred) ? 0 : parseFloat(state.draft.deferred || 0)
      const commitment = isNaN(state.draft.commitment) ? 0 : parseFloat(state.draft.commitment || 0)
      // Assignment
      // TO DO sacar porcentaje de acuerdo al commitment share_x100
      let ratioUsdEquity = typeProposal === 'assignment' ? parseFloat(state.draft.annualUsdSalary || 0) : parseFloat(state.draft.usdAmount || 0)

      if (typeProposal === 'assignment') {
        ratioUsdEquity = ratioUsdEquity * (commitment * 0.01)
        // ratioUsdEquity = ratioUsdEquity / 12
      } else if (typeProposal === 'archetype') {
        ratioUsdEquity = parseFloat(state.draft.annualUsdSalary || 0)
        deferredSan = isNaN(state.draft.minDeferred) ? 0 : parseFloat(state.draft.minDeferred || 0)
      }
      // TO DO dividir entre 12 para mostrar por mes, mostrar uun lbael para informar que es mensual solo para assignmnt, y archertypes

      commit('setPeg', (ratioUsdEquity * (1 - deferredSan * 0.01)))
      commit('setReward', (ratioUsdEquity * deferredSan * 0.01 / rootState.dao.settings.rewardToPegRatio))
      commit('setVoice', ratioUsdEquity)

      // Para badges multiply multiplicar x 100 y sumar 10,000
    },

    saveDraft ({ commit, state }) {
      localStorage.setItem('proposal-draft', JSON.stringify(state.draft))
      // commit('reset', true)
    },

    continueDraft ({ commit }, draft) {
      commit('setDraft', draft)
    },

    async publishProposal ({ state, rootState }) {
      try {
        const draft = state.draft

        switch (draft.type) {
          case 'Payout': {
            const content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'recipient', value: ['name', rootState.accounts.account] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
              { label: 'url', value: ['string', draft.url] },
              { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
              { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
              { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] }
            ]

            const actions = [{
              account: this.$config.contracts.dao,
              name: 'propose',
              data: {
                dao_id: rootState.dao.docId,
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
              { label: 'role', value: ['int64', draft.role.docId] },
              { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
              { label: 'period_count', value: ['int64', draft.periodCount] }
            ]

            const actions = [{
              account: this.$config.contracts.dao,
              name: 'propose',
              data: {
                dao_id: rootState.dao.docId,
                proposer: rootState.accounts.account,
                proposal_type: 'assignment',
                content_groups: [content],
                publish: true
              }
            }]
            return this.$api.signTransaction(actions)
          }
          case 'Assignment Badge': {
            const content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'assignee', value: ['name', rootState.accounts.account] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
              { label: 'badge', value: ['int64', draft.badge.docId] },
              { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
              { label: 'period_count', value: ['int64', draft.periodCount] }
            ]

            const actions = [{
              account: this.$config.contracts.dao,
              name: 'propose',
              data: {
                dao_id: rootState.dao.docId,
                proposer: rootState.accounts.account,
                proposal_type: 'assignbadge',
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
                dao_id: rootState.dao.docId,
                proposer: rootState.accounts.account,
                proposal_type: 'role',
                content_groups: [content],
                publish: true
              }
            }]
            return this.$api.signTransaction(actions)
          }

          case 'Badge': {
            const content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', new Turndown().turndown(draft.description)] },
              { label: 'icon', value: ['string', draft.icon] },
              { label: 'voice_coefficient_x10000', value: ['int64', parseFloat(draft.voiceCoefficient.value)] },
              { label: 'reward_coefficient_x10000', value: ['int64', parseFloat(draft.rewardCoefficient.value)] },
              { label: 'peg_coefficient_x10000', value: ['int64', parseFloat(draft.pegCoefficient.value)] },
              { label: 'max_period_count', value: ['int64', parseFloat(draft.badgeRestriction)] }
            ]
            const actions = [{
              account: this.$config.contracts.dao,
              name: 'propose',
              data: {
                dao_id: rootState.dao.docId,
                proposer: rootState.accounts.account,
                proposal_type: 'badge',
                content_groups: [content],
                publish: true
              }
            }]
            return this.$api.signTransaction(actions)
          }
        }
      } catch (e) {
        throw new Error(e)
      }
    },
    suspendProposal ({ rootState }, docId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'suspend',
        data: {
          document_id: docId,
          proposer: rootState.accounts.account,
          reason: ''
        }
      }]
      return this.$api.signTransaction(actions)
    },
    activeProposal ({ rootState }, docId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'closedocprop',
        data: {
          proposal_id: docId
        }
      }]
      return this.$api.signTransaction(actions)
    }
  }
}

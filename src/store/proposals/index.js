import Storage from '~/localStorage/storage'
import { PROPOSAL_TYPE } from '~/const'
/**
 * This vuex data store contains the data needed in the proposal creation wizard.
 */

const VOTER_BADGE_TITLE = 'Voter'
const DELEGATE_BADGE_TITLE = 'Delegate'

export default {
  namespaced: true,
  state: {
    draft: {
      type: 'Payout',
      category: {},
      title: '',
      description: '',
      circle: {},
      url: '',
      pastSteps: null,

      // For payouts
      usdAmount: 0,
      deferred: 0, // Also used for assignments
      peg: 0,
      reward: 0,
      voice: 0,
      custom: false,

      // For assignments
      commitment: 0,
      role: null,
      badge: null,
      startPeriod: null,
      periodCount: null,
      detailsPeriod: null,
      startDate: null,
      endIndex: null,

      // For roles/archetypes
      annualUsdSalary: 0,
      roleCapacity: 0,
      minDeferred: 0,
      minCommitment: 0,

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
      badgeRestriction: 24,
      purpose: '',
      next: false,
      stepIndex: null,
      daoId: null,
      edit: false,
      linkedDocId: null,

      // Original document for edits (extensions)
      original: null,

      //
      parentId: null,
      masterPolicy: null,
      questType: null,
      votingMethod: null
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
      state.draft.minCommitment = 0
      state.draft.icon = null
      state.draft.next = false
      state.draft.stepIndex = 0
      state.draft.custom = false
      state.draft.edit = false
      state.draft.linkedDocId = null
      state.draft.original = null
      state.draft.pastSteps = null
      state.draft.purpose = ''
      state.draft.parentId = null
      state.draft.masterPolicy = null
      state.draft.questType = null
      state.draft.votingMethod = null
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
      state.draft.custom = false

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
      state.draft.minCommitment = 0

      // For Organization/Badges
      state.draft.icon = null
      state.draft.rewardCoefficient = {
        label: 0,
        value: 10000
      }
      state.draft.voiceCoefficient = {
        label: 0,
        value: 10000
      }
      state.draft.pegCoefficient = {
        label: 0,
        value: 10000
      }
      state.draft.badgeRestriction = 24
      state.draft.next = false
      state.draft.stepIndex = 0
      state.draft.original = null
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
      state.draft.minCommitment = 0
      state.draft.pegCoefficient = {
        label: 0,
        value: 10000
      }
      state.draft.rewarCoefficient = {
        label: 0,
        value: 10000
      }
      state.draft.voiceCoefficient = {
        label: 0,
        value: 10000
      }
    },

    setCategory (state, category) {
      state.draft.category = { ...category }
    },

    setLinkedDocId (state, linkedDocId) {
      state.draft.linkedDocId = linkedDocId
    },

    setEdit (state, edit) {
      state.draft.edit = edit
    },

    setState (state, value) {
      state.draft.state = value
    },

    setTitle (state, title) {
      state.draft.title = title
    },

    setDescription (state, description) {
      state.draft.description = description
    },

    setCircle (state, circle) {
      state.draft.circle = circle
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

    setEndIndex (state, endIndex) {
      state.draft.endIndex = endIndex
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

    setMinCommitment (state, minCommitment) {
      state.draft.minCommitment = Math.max(0, Math.min(minCommitment, 100))
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

    setPurpose (state, purpose) {
      state.draft.purpose = purpose
    },

    setParent (state, parentId) {
      state.draft.parentId = parentId
    },

    setNext (state, next) {
      state.draft.next = next
    },

    setStepIndex (state, stepIndex) {
      state.draft.stepIndex = stepIndex
    },

    setCustom (state, customState) {
      state.draft.custom = customState
    },

    setDraftId (state, draftId) {
      state.draft.draftId = draftId
    },

    setDaoId (state, daoId) {
      state.draft.daoId = daoId
    },

    setProposalId (state, proposalId) {
      state.draft.proposalId = proposalId
    },

    setOriginal (state, original) {
      state.draft.original = original
    },

    setPastSteps (state, pastSteps) {
      state.draft.pastSteps = pastSteps
    },

    setMasterPolicy (state, masterPolicy) {
      state.draft.masterPolicy = masterPolicy
    },

    setQuestType (state, questType) {
      state.draft.questType = questType
    },

    setVotingMethod (state, votingMethod) {
      state.draft.votingMethod = votingMethod
    }
  },

  actions: {
    closeDocumentProposal (context, docId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'closedocprop',
        data: {
          proposal_id: docId
        }
      }]
      return this.$api.signTransaction(actions)
    },

    calculateTokens ({ commit, state, rootState }) {
      const typeProposal = state.draft.category.key
      let deferredSan = isNaN(state.draft.deferred) ? 0 : parseFloat(state.draft.deferred || 0)
      const commitment = isNaN(state.draft.commitment) ? 0 : parseFloat(state.draft.commitment || 0)
      // Assignment
      // TO DO sacar porcentaje de acuerdo al commitment share_x100
      let ratioUsdEquity = typeProposal === 'assignment' ? parseFloat(state.draft.annualUsdSalary || 0) / 12 : parseFloat(state.draft.usdAmount || 0)

      if (typeProposal === 'assignment') {
        ratioUsdEquity = ratioUsdEquity * (commitment * 0.01)
        // ratioUsdEquity = ratioUsdEquity / 12
      } else if (typeProposal === 'archetype') {
        ratioUsdEquity = parseFloat(state.draft.annualUsdSalary || 0) / 12
        deferredSan = isNaN(state.draft.minDeferred) ? 0 : parseFloat(state.draft.minDeferred || 0)
      }
      // TO DO dividir entre 12 para mostrar por mes, mostrar uun lbael para informar que es mensual solo para assignmnt, y archertypes

      commit('setPeg', (ratioUsdEquity * (1 - deferredSan * 0.01)).toFixed(0))
      commit('setReward', (ratioUsdEquity * deferredSan * 0.01 / rootState.dao.settings.rewardToPegRatio).toFixed(0))
      commit('setVoice', ratioUsdEquity.toFixed(0))

      // Para badges multiply multiplicar x 100 y sumar 10,000
    },

    saveDraft ({ state, rootState }) {
      const draftProposals = new Storage({ key: 'draftProposals' })
      const draftId = state.draft.draftId || `${state.draft.title} - ${Date.now()}`
      draftProposals.addEntry(draftId, {
        ...state.draft,
        lastEdited: Date.now(),
        daoId: rootState.dao.docId
      })
    },

    removeDraft ({ state }, draft) {
      const draftProposals = new Storage({ key: 'draftProposals' })
      const draftId = draft.draftId
      draftProposals.removeEntry(draftId)
    },

    getAllDrafts ({ rootState }) {
      try {
        const draftProposals = new Storage({ key: 'draftProposals' })
        const drafts = Array.from(draftProposals.getAll())
        return drafts.filter(draft => draft[1].daoId === rootState.dao.docId)
      } catch (e) {
        return []
      }
    },

    continueDraft ({ commit }, draft) {
      commit('setDraft', draft)
    },

    async createProposal ({ state, rootState }) {
      try {
        const draft = state.draft
        let content
        let proposalType
        let publishToStaging

        if (draft.edit) {
          proposalType = 'edit'
          publishToStaging = false
          content = [
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'period_count', value: ['int64', draft.periodCount] },
            { label: 'original_document', value: ['int64', draft.linkedDocId] },
            { label: 'ballot_title', value: ['string', draft.title] },
            { label: 'ballot_description', value: ['string', draft.description] }
          ]
        } else {
          if (draft?.badge?.details_title_s === VOTER_BADGE_TITLE ||
              draft?.badge?.details_title_s === DELEGATE_BADGE_TITLE
          ) {
            publishToStaging = false
          } else {
            publishToStaging = true
          }
          switch (draft.type) {
            case PROPOSAL_TYPE.PAYOUT:
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'recipient', value: ['name', rootState.accounts.account] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'url', value: ['string', draft.url] },
                { label: 'is_custom', value: ['int64', draft.custom ? 1 : 0] },
                { label: 'deferred_perc_x100', value: ['int64', draft.deferred] }
                // { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
                // { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
                // { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] }
              ]

              if (draft.custom) {
                content.push(
                  { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
                  { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
                  { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] }
                )
              } else {
                content.push(
                  { label: 'usd_amount', value: ['asset', `${parseFloat(draft.usdAmount.toFixed(2))} USD`] }
                )
              }
              proposalType = 'payout'
              break

            // Role assignment
            case PROPOSAL_TYPE.ROLE:
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'assignee', value: ['name', rootState.accounts.account] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                // { label: 'url', value: ['string', draft.url] },
                { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
                { label: 'time_share_x100', value: ['int64', draft.commitment] },
                { label: 'deferred_perc_x100', value: ['int64', draft.deferred] },
                { label: 'role', value: ['int64', draft.role.docId] },
                { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
                { label: 'period_count', value: ['int64', draft.periodCount] }
              ]
              proposalType = 'assignment'
              break

            case PROPOSAL_TYPE.ABILITY:
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'assignee', value: ['name', rootState.accounts.account] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'badge', value: ['int64', draft.badge.docId] },
                { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
                { label: 'period_count', value: ['int64', draft.periodCount] }
              ]
              proposalType = 'assignbadge'
              break

            case PROPOSAL_TYPE.ARCHETYPE:
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'url', value: ['string', draft.url] },
                { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
                { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.roleCapacity) * 100)] },
                { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.minDeferred))] }
              ]
              proposalType = 'role'
              break

            case PROPOSAL_TYPE.BADGE:
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'icon', value: ['string', draft.icon] },
                { label: 'voice_coefficient_x10000', value: ['int64', parseFloat(draft.voiceCoefficient.value)] },
                { label: 'reward_coefficient_x10000', value: ['int64', parseFloat(draft.rewardCoefficient.value)] },
                { label: 'peg_coefficient_x10000', value: ['int64', parseFloat(draft.pegCoefficient.value)] },
                { label: 'purpose', value: ['string', draft.purpose] }
              ]
              proposalType = 'badge'
              break

            case PROPOSAL_TYPE.CIRCLE :
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'name', value: ['string', ''] },
                { label: 'purpose', value: ['string', draft.purpose] },
                ...(draft.parentId ? [{ label: 'parent_circle', value: ['int64', draft.parentId.value] }] : [])
              ]
              proposalType = 'circle'
              break

            case PROPOSAL_TYPE.POLICY :
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'url', value: ['string', draft.url] },
                { label: 'name', value: ['string', ''] },
                ...(draft.parentId ? [{ label: 'circle_id', value: ['int64', draft.parentId.value] }] : []),
                ...(draft.masterPolicy ? [{ label: 'master_policy', value: ['int64', draft.masterPolicy.value] }] : [])
              ]
              proposalType = 'policy'
              break

            case PROPOSAL_TYPE.QUEST :
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'url', value: ['string', draft.url] },
                { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
                { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.roleCapacity) * 100)] },
                { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.minDeferred))] },

                { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
                { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
                { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] },

                { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
                { label: 'period_count', value: ['int64', draft.periodCount] },
                { label: 'recipient', value: ['name', rootState.accounts.account] }
                // ...(draft.parentId ? [{ label: 'circle_id', value: ['int64', draft.parentId.value] }] : []),
                // ...(draft.parentQuest ? [{ label: 'quest_start', value: ['int64', draft.parentQuest.value] }] : [])
              ]
              proposalType = 'queststart'
              break

            case PROPOSAL_TYPE.BUDGET :
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'deferred_perc_x100', value: ['int64', draft.deferred] },
                { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
                { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
                { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] },
                { label: 'usd_amount', value: ['asset', `${parseFloat(draft.usdAmount.toFixed(2))} USD`] },
                ...(draft.circle ? [{ label: 'circle_id', value: ['int64', draft.circle.value] }] : [])
              ]
              proposalType = 'budget'
              break

            case PROPOSAL_TYPE.POLL :
              content = [
                { label: 'content_group_label', value: ['string', 'details'] },
                { label: 'title', value: ['string', draft.title] },
                { label: 'description', value: ['string', draft.description] },
                { label: 'voting_method', value: ['string', draft.votingMethod.value] }
              ]
              proposalType = 'poll'
              break
          }
        }

        if (content) {
          const actions = [{
            account: this.$config.contracts.dao,
            name: 'propose',
            data: {
              dao_id: rootState.dao.docId,
              proposer: rootState.accounts.account,
              proposal_type: proposalType,
              content_groups: [content],
              publish: !publishToStaging
            }
          }]

          return this.$api.signTransaction(actions)
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async applyForBadge ({ state, rootState }, type) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'propose',
        data: {
          dao_id: rootState.dao.docId,
          proposer: rootState.accounts.account,
          proposal_type: 'assignbadge',
          content_groups: [[
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'assignee', value: ['name', rootState.accounts.account] },
            { label: 'title', value: ['string', type === 'Voter' ? 'Voter' : 'Delegate'] },
            { label: 'description', value: ['string', type === 'Voter' ? 'Voter' : 'Delegate'] },
            { label: 'badge', value: ['int64', state.draft.badge.docId] }
          ]],
          publish: true
        }
      }]

      return this.$api.signTransaction(actions)
    },
    // TODO: Refactor this to avoid duplicated code with createProposal
    async updateProposal ({ state, rootState }) {
      try {
        const draft = state.draft
        let content
        switch (draft.type) {
          case PROPOSAL_TYPE.PAYOUT:
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'recipient', value: ['name', rootState.accounts.account] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'is_custom', value: ['int64', draft.custom ? 1 : 0] },
              { label: 'url', value: ['string', draft.url] },
              { label: 'deferred_perc_x100', value: ['int64', draft.deferred] }

            ]

            if (draft.custom) {
              content.push(
                { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
                { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
                { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] }
              )
            } else {
              content.push(
                { label: 'usd_amount', value: ['asset', `${parseFloat(draft.usdAmount.toFixed(2))} USD`] }
              )
            }
            break

          // Role assignment
          case PROPOSAL_TYPE.ROLE:
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'assignee', value: ['name', rootState.accounts.account] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              // { label: 'url', value: ['string', draft.url] },
              { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
              { label: 'time_share_x100', value: ['int64', draft.commitment] },
              { label: 'deferred_perc_x100', value: ['int64', draft.deferred] },
              { label: 'role', value: ['int64', draft.role.docId] },
              { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
              { label: 'period_count', value: ['int64', draft.periodCount] }
            ]
            break

          case PROPOSAL_TYPE.ABILITY:
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'assignee', value: ['name', rootState.accounts.account] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'badge', value: ['int64', draft.badge.docId] },
              { label: 'start_period', value: ['int64', draft.startPeriod.docId] },
              { label: 'period_count', value: ['int64', draft.periodCount] }
            ]
            break

          case PROPOSAL_TYPE.ARCHETYPE:
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'url', value: ['string', draft.url] },
              { label: 'annual_usd_salary', value: ['asset', `${parseFloat(draft.annualUsdSalary).toFixed(2)} USD`] },
              { label: 'fulltime_capacity_x100', value: ['int64', Math.round(parseFloat(draft.roleCapacity) * 100)] },
              { label: 'min_deferred_x100', value: ['int64', Math.round(parseFloat(draft.minDeferred))] }
            ]
            break

          case PROPOSAL_TYPE.BADGE:
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'icon', value: ['string', draft.icon] },
              { label: 'voice_coefficient_x10000', value: ['int64', parseFloat(draft.voiceCoefficient.value)] },
              { label: 'reward_coefficient_x10000', value: ['int64', parseFloat(draft.rewardCoefficient.value)] },
              { label: 'peg_coefficient_x10000', value: ['int64', parseFloat(draft.pegCoefficient.value)] },
              { label: 'purpose', value: ['string', draft.purpose] }
            ]
            break

          case PROPOSAL_TYPE.BUDGET :
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'deferred_perc_x100', value: ['int64', draft.deferred] },
              { label: 'voice_amount', value: ['asset', `${parseFloat(draft.voice).toFixed(rootState.dao.settings.voiceTokenDecimals)} ${rootState.dao.settings.voiceToken}`] },
              { label: 'reward_amount', value: ['asset', `${parseFloat(draft.reward).toFixed(rootState.dao.settings.rewardTokenDecimals)} ${rootState.dao.settings.rewardToken}`] },
              { label: 'peg_amount', value: ['asset', `${parseFloat(draft.peg).toFixed(rootState.dao.settings.pegTokenDecimals)} ${rootState.dao.settings.pegToken}`] },
              { label: 'usd_amount', value: ['asset', `${parseFloat(draft.usdAmount.toFixed(2))} USD`] },
              ...(draft.circle ? [{ label: 'circle_id', value: ['int64', draft.circle.value] }] : [])
            ]
            break

          case PROPOSAL_TYPE.POLL :
            content = [
              { label: 'content_group_label', value: ['string', 'details'] },
              { label: 'title', value: ['string', draft.title] },
              { label: 'description', value: ['string', draft.description] },
              { label: 'voting_method', value: ['string', draft.votingMethod.value] }
            ]
            break
        }
        if (content) {
          const actions = [{
            account: this.$config.contracts.dao,
            name: 'proposeupd',
            data: {
              proposer: rootState.accounts.account,
              proposal_id: draft.proposalId,
              content_groups: [content]
            }
          }]
          return this.$api.signTransaction(actions)
        }
      } catch (e) {
        throw new Error(e)
      }
    },

    async deleteProposal ({ state, rootState }, proposalId) {
      try {
        const actions = [{
          account: this.$config.contracts.dao,
          name: 'proposerem',
          data: {
            proposer: rootState.accounts.account,
            proposal_id: proposalId
          }
        }]

        return this.$api.signTransaction(actions)
      } catch (e) {
        throw new Error(e)
      }
    },

    async publishProposal ({ state, rootState }, proposalId) {
      try {
        const actions = [{
          account: this.$config.contracts.dao,
          name: 'proposepub',
          data: {
            proposer: rootState.accounts.account,
            proposal_id: proposalId
          }
        }]

        return this.$api.signTransaction(actions)
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
    },

    withdrawProposal ({ rootState }, docId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'withdraw',
        data: {
          owner: rootState.accounts.account,
          document_id: docId
        }
      }]
      return this.$api.signTransaction(actions)
    },

    async createQuestPayout ({ state, rootState }, data) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'propose',
        data: {
          dao_id: rootState.dao.docId,
          proposer: rootState.accounts.account,
          proposal_type: 'questcomplet',
          content_groups: [[
            { label: 'content_group_label', value: ['string', 'details'] },
            { label: 'title', value: ['string', data.title] },
            { label: 'description', value: ['string', data.description] },
            { label: 'quest_start', value: ['int64', data.questStartId] }
          ]],
          publish: true
        }
      }]

      return this.$api.signTransaction(actions)
    },

    async createProposalComment ({ state, rootState }, { content, parentId }) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'cmntadd',
        data: {
          author: rootState.accounts.account,
          content,
          comment_or_section_id: Number(parentId)
        }
      }]

      return this.$api.signTransaction(actions)
    },

    async updateProposalComment ({ state, rootState }, { content, commentId }) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'cmntupd',
        data: {
          new_content: content,
          comment_id: Number(commentId)
        }
      }]

      return this.$api.signTransaction(actions)
    },

    async deleteProposalComment ({ state, rootState }, commentId) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'cmntrem',
        data: {
          comment_id: Number(commentId)
        }
      }]

      return this.$api.signTransaction(actions)
    },

    async reactProposalComment ({ state, rootState }, { commentId, reaction }) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'reactadd',
        data: {
          user: rootState.accounts.account,
          reaction,
          document_id: Number(commentId)
        }
      }]

      return this.$api.signTransaction(actions)
    },

    async unreactProposalComment ({ state, rootState }, { commentId }) {
      const actions = [{
        account: this.$config.contracts.dao,
        name: 'reactrem',
        data: {
          user: rootState.accounts.account,
          document_id: Number(commentId)
        }
      }]

      return this.$api.signTransaction(actions)
    }

  }
}

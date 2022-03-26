<script>
import CONFIG from './create/config.json'
import { mapActions } from 'vuex'

export default {
  name: 'proposal-create',
  components: {
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepCompensation: () => import('./create/StepCompensation.vue'),
    StepDateDuration: () => import('./create/StepDateDuration.vue'),
    StepDescription: () => import('./create/StepDescription.vue'),
    StepProposalType: () => import('./create/StepProposalType.vue'),
    StepReview: () => import('./create/StepReview.vue'),
    StepIcon: () => import('./create/StepIcon.vue'),
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue')
  },

  props: {
    // TODO: Props should include route parameters
    // this will allow back button in creation wizard
    // step: String? - used to calculate stepIndex
    // type: String? - replaces selection in data
  },

  data () {
    return {
      // Freeze the config to disable reactivity (performance)
      config: Object.freeze(CONFIG),
      drafts: null,
      selection: null, // The key of the selected option from the config
      reference: null,
      // stepIndex: 0,
      confirmLeavePage: null,
      next: null
    }
  },

  computed: {
    stepIndex: {
      get () {
        return this.$store.state.proposals.draft.stepIndex || 0
      },
      set (value) {
        this.$store.commit('proposals/setStepIndex', value)
      }
    },
    stepProps () {
      return {
        config: this.config,
        drafts: this.drafts,
        fields: this.fieldsBasedOnSelection,
        selection: this.selection,
        reference: this.reference,
        stepIndex: this.stepIndex
      }
    },

    fieldsBasedOnSelection () {
      // Fields from the selection are added to the base fields
      // Currently we do not merge properties -- but you could overwrite a field entirely
      const fields = Object.assign(
        {},
        this.config.fields,
        this.selectedConfig && this.selectedConfig.fields ? this.selectedConfig.fields : {}
      )

      return fields
    },

    stepsBasedOnSelection () {
      const steps = {}

      // Merge step settings in from the selected config
      Object.values(this.config.steps).forEach((step) => {
        let selectStep = {}
        if (this.selectedConfig && this.selectedConfig.steps && this.selectedConfig.steps[step.key]) {
          selectStep = this.selectedConfig.steps[step.key]
        }

        steps[step.key] = Object.assign({}, step, selectStep)
      })

      // Return the steps in order
      return Object.values(steps).sort((a, b) => a.index - b.index)
    },

    selectedConfig () {
      if (this.selection) {
        if (this.config.options[this.selection]) {
          return this.config.options[this.selection]
        }

        let result = null
        let found = false
        Object.values(this.config.options).forEach((opt) => {
          if (!found && opt.options[this.selection]) {
            result = opt.options[this.selection]
            found = true
          }
        })

        return result
      }

      return null
    }
  },
  async beforeRouteLeave (to, from, next) {
    this.getDraft()
    const storeDraft = this.$store.state.proposals.draft || { title: 'store ' }
    const localDraft = this.draft || { title: 'local' }
    // console.log('drafts', this.deepEqual(storeDraft, this.draft))
    this.next = next
    if ((!this.draft || !this.deepEqual(storeDraft, localDraft)) && storeDraft.title) {
      this.confirmLeavePage = true
    } else {
      this.$store.commit('proposals/reset')
      next()
    }
  },

  activated () {
    // Check for drafts in localStorage
    this.getDraft()
  },
  created () {
    this.getDraft()
  },
  methods: {
    ...mapActions('proposals', ['publishProposal', 'getAllDrafts', 'removeDraft']),
    deepEqual (object1, object2) {
      const keys1 = Object.keys(object1)
      const keys2 = Object.keys(object2)
      if (keys1.length !== keys2.length) {
        return false
      }
      for (const key of keys1) {
        const val1 = object1[key]
        const val2 = object2[key]
        const areObjects = this.isObject(val1) && this.isObject(val2)
        if ((areObjects && !this.deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
          return false
        }
      }
      return true
    },
    isObject (object) {
      return object != null && typeof object === 'object'
    },
    onLeavePageConfirmed (answer) {
      this.confirmLeavePage = false
      if (answer) {
        this.$store.commit('proposals/reset')
        this.next()
      } else {
        this.saveDraftProposal()
        this.$store.commit('proposals/reset')
        this.next()
      }
    },
    async getDraft () {
      try {
        // const draftString = localStorage.getItem('proposal-draft')
        const allDrafts = await this.getAllDrafts()
        this.drafts = allDrafts.map(v => {
          const draft = v[1]
          if (draft.type === 'Assignment Badge') this.reference = draft.badge
          if (draft.type === 'Role assignment') this.reference = draft.role
          draft.next = false
          draft.draftId = v[0]
          return draft
        })
        // if (draftString) {
        //   this.drafts = JSON.parse(draftString)
        //   if (this.draft.next) {
        //   if (this.draft.type === 'Assignment Badge') this.reference = this.draft.badge
        //   if (this.draft.type === 'Role assignment') this.reference = this.draft.role
        //   this.draft.next = false
        //   console.log('stepIndex getDraft', this.stepIndex)
        //   this.stepIndex = 0
        //   this.continueDraft(this.draft)
        //   this.deleteDraft()
        //   this.nextStep()
        // }
      } catch (e) {

      }
    },
    gotoStep (key) {
      this.stepIndex = this.config.steps[key].index - 1
    },

    nextStep () {
      this.stepIndex += 1
      while (this.stepsBasedOnSelection[this.stepIndex].skip) {
        this.stepIndex += 1
      }
    },

    prevStep () {
      this.stepIndex -= 1
      while (this.stepsBasedOnSelection[this.stepIndex].skip) {
        this.stepIndex -= 1
      }
    },

    select (option) {
      this.selection = option
      this.reference = null
      if (this.selectedConfig.type) {
        this.$store.commit('proposals/setType', this.selectedConfig.type)
        this.$store.commit('proposals/restoreDraftDetails')
      }
      if (this.selectedConfig.title) {
        this.$store.commit('proposals/setCategory', { key: this.selection, title: this.selectedConfig.title })
      }
    },

    refer (obj) {
      this.reference = obj
      if (this.selectedConfig.type === 'Assignment') {
        this.$store.commit('proposals/setRole', this.reference)
        this.$store.commit('proposals/setAnnualUsdSalary', this.reference.salary)
        this.$store.commit('proposals/setMinDeferred', this.reference.minDeferred)
      } else if (this.selectedConfig.type === 'Assignment Badge') {
        this.$store.commit('proposals/setBadge', this.reference)
        this.$store.commit('proposals/setRewardCoefficientLabel', (this.reference.details_rewardCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setRewardCoefficient', this.reference.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (this.reference.details_voiceCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setVoiceCoefficient', this.reference.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (this.reference.details_pegCoefficientX10000_i - 10000) / 100)
        this.$store.commit('proposals/setPegCoefficient', this.reference.details_pegCoefficientX10000_i)
        this.$store.commit('proposals/setIcon', this.reference.details_icon_s)
      }
    },

    continueDraft (draft) {
      this.$store.dispatch('proposals/continueDraft', draft)

      if (draft.category) {
        this.selection = draft.category.key
        // TODO: Go to next step if selection is done?
        // this.nextStep()
      }
    },

    saveDraftProposal () {
      this.draft = { ...this.$store.state.proposals.draft }
      this.$store.dispatch('proposals/saveDraft')
      this.showNotification({
        message: 'Draft saved successfully'
      })
    },

    deleteDraft (draft) {
      this.removeDraft(draft)
      this.getDraft()
      // this.draft = null
    },

    async exPublishProposal () {
      try {
        await this.publishProposal()
        setTimeout(() => {
          this.$store.commit('proposals/reset')
          this.$router.push({ name: 'proposals' })
        }, 1500)
      } catch (e) {
        const message = e.message || e.cause.message
        // this.saveDraftProposal()
        this.showNotification({
          message,
          color: 'red'
        })
        console.error('Publish proposal failed ', e) // eslint-disable-line no-console
      }
    }
  }
}
</script>

<template lang="pug">
.proposal-create
  .headline-widget.q-mb-md New Proposal
    span.headline-widget(v-if="selectedConfig && selectedConfig.title")  - {{ selectedConfig.title }}
  confirm-action-modal(
    v-model="confirmLeavePage"
    @responded="onLeavePageConfirmed"
    title="Are you sure you want to leave without saving your draft?"
  )
    template(v-slot:buttons-actions)
      .row.q-mt-sm.q-col-gutter-md
        .col
          q-btn.full-width(
            no-caps
            label="Leave without saving draft"
            rounded
            color="green"
            @click="onLeavePageConfirmed(true)"
          )
        .col
          q-btn.full-width(
            no-caps
            label="Save draft and leave page"
            rounded
            color="primary"
            @click="onLeavePageConfirmed(false)"
          )
  .row.full-width.q-my-md.q-mt-lg
    .col-9.q-pr-sm
      keep-alive
        component(
          :is="stepsBasedOnSelection[stepIndex].component"
          v-bind="stepProps"
          @select="select"
          @refer="refer"
          @next="nextStep"
          @prev="prevStep"
          @continue="continueDraft"
          @delete="deleteDraft"
        )

    .col-3.q-pl-sm
      creation-stepper(
        :steps="stepsBasedOnSelection"
        :stepIndex="stepIndex"
        @goto="gotoStep"
        @save="saveDraftProposal(true)"
        @publish="exPublishProposal"
      )
</template>

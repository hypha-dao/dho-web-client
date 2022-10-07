<script>
import CONFIG from './create/config.json'
import { mapActions } from 'vuex'

export default {
  name: 'proposal-create',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepCompensation: () => import('./create/StepCompensation.vue'),
    StepDateDuration: () => import('./create/StepDateDuration.vue'),
    StepDescription: () => import('./create/StepDescription.vue'),
    StepIcon: () => import('./create/StepIcon.vue'),
    StepProposalType: () => import('./create/StepProposalType.vue'),
    StepReview: () => import('./create/StepReview.vue')
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
    },

    status () { return this.$store.state.proposals.draft.state },
    filteredSteps () { return this.stepsBasedOnSelection.filter(s => !s.skip) },
    lastStep () { return this.stepIndex === this.filteredSteps[this.filteredSteps.length - 1].index - 1 }
  },
  async beforeRouteLeave (to, from, next) {
    this.getDraft()
    const storeDraft = this.$store.state.proposals.draft || { title: 'store ' }
    const localDraft = this.draft || { title: 'local' }
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
    if (this.$store.state.proposals.draft.stepIndex === 0 ||
        this.$store.state.proposals.draft.stepIndex === undefined) {
      this.$route.meta.title = 'Create Proposal'
      this.$router.replace({ query: { temp: Date.now() } })
    }
  },
  deactivated () {
    this.selection = null
    this.reference = null
  },
  created () {
    this.getDraft()
  },
  methods: {
    ...mapActions('proposals', ['createProposal', 'updateProposal', 'getAllDrafts', 'removeDraft']),
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
        this.saveDraft()
        this.$store.commit('proposals/reset')
        this.next()
      }
    },
    async getDraft () {
      try {
        // const draftString = localStorage.getItem('proposal-draft')
        const allDrafts = await this.getAllDrafts()
        const drafts = allDrafts.map(v => {
          const draft = v[1]
          if (draft.type === 'Assignment Badge') this.reference = draft.badge
          if (draft.type === 'Assignbadge') this.reference = draft.badge
          if (draft.type === 'Assignment') this.reference = draft.role

          draft.next = false
          draft.draftId = v[0]
          return draft
        })
        this.drafts = drafts.sort((a, b) => b.lastEdited - a.lastEdited)

        const draftId = this.$route.params.draftId
        if (draftId) {
          const draft = drafts.find(d => d.draftId === draftId)
          if (draft.type === 'Assignment Badge') this.reference = draft.badge
          if (draft.type === 'e assignment') this.reference = draft.role
          this.continueDraft(draft)
          this.deleteDraft(draft)
        }
        // if (draftString) {
        //   this.drafts = JSON.parse(draftString)
        //   if (this.draft.next) {
        //   if (this.draft.type === 'Assignment Badge') this.reference = this.draft.badge
        //   if (this.draft.type === 'Role assignment') this.reference = this.draft.role
        //   this.draft.next = false
        //   this.stepIndex = 0
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
      this.$router.replace({ query: { temp: Date.now() } })
    },

    prevStep () {
      if (this.stepIndex > 0) {
        this.stepIndex -= 1
        while (this.stepsBasedOnSelection[this.stepIndex].skip) {
          this.stepIndex -= 1
        }
        if (this.stepIndex === 0) {
          const headerName = this.$route.meta.title.split('>')
          this.$route.meta.title = `${headerName[0]} > ${headerName[1]}`
          this.$router.replace({ query: { temp: Date.now() } })
        }
      }
    },

    goToStep (step) {
      this.stepIndex = step
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
        this.$store.commit('proposals/setAnnualUsdSalary', this.reference.salary ? this.reference.salary : this.reference.details_annualUsdSalary_a)
        this.$store.commit('proposals/setMinDeferred', this.reference.minDeferred ? this.reference.minDeferred : this.reference.details_minDeferredX100_i)
        this.$store.commit('proposals/setMinCommitment', this.reference.minCommitment ? this.reference.minCommitment : this.reference.details_minTimeShareX100_i)
      } else if (this.selectedConfig.type === 'Assignment Badge') {
        this.$store.commit('proposals/setBadge', this.reference)
        this.$store.commit('proposals/setRewardCoefficientLabel', (this.reference.details_rewardCoefficientX10000_i) / 10000)
        this.$store.commit('proposals/setRewardCoefficient', this.reference.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (this.reference.details_voiceCoefficientX10000_i) / 10000)
        this.$store.commit('proposals/setVoiceCoefficient', this.reference.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (this.reference.details_pegCoefficientX10000_i) / 10000)
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

    saveDraft () {
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

    async stageProposal () {
      try {
        if (this.status === 'drafted') await this.updateProposal()
        else await this.createProposal()

        const data = { ...this.$store.state.proposals.draft }

        const draftId = this.$store.state.proposals.draft.draftId || undefined
        if (draftId) {
          this.deleteDraft(this.$store.state.proposals.draft)
        }
        this.$store.commit('proposals/reset')

        this.$router.push({ name: 'proposals', params: { data }, query: { refetch: true } })

        // setTimeout(() => this.$router.push({ name: 'proposals', query: { data, refetch: true } }), 700)
      } catch (e) {
        const message = e.message || e.cause.message
        // this.saveDraft()
        this.showNotification({
          message,
          color: 'red'
        })
      }
    },
  },

  watch: {
    'selectedConfig.title': {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          const title = this.$route.meta.title
          this.$route.meta.title = `${title.split('>')[0].trim()} > ${value?.trim()}`
          this.$router.replace({ query: { temp: Date.now() } }) // workaround to force router reload
        }
      }
    }
  }
}
</script>

<template lang="pug">
.proposal-create
  template(v-if="$q.platform.is.desktop")
    confirm-action-modal(
      v-model="confirmLeavePage"
      @responded="onLeavePageConfirmed"
      title="Are you sure you want to leave without saving your draft?"
    )
      template(v-slot:buttons-actions)
        .row.q-mt-sm.q-col-gutter-md.justify-end
          .col-10
            .row
              .col
                q-btn.full-width(
                  no-caps
                  label="Leave without saving"
                  flat
                  rounded
                  color="primary"
                  @click="onLeavePageConfirmed(true)"
                )
              .col
                q-btn.full-width(
                  no-caps
                  label="Save draft and leave"
                  rounded
                  color="primary"
                  @click="onLeavePageConfirmed(false)"
                )
    .row.full-width.q-my-md.q-mt-lg
      .col-9
          component(
            :is="stepsBasedOnSelection[stepIndex].component"
            @continue="continueDraft"
            @delete="deleteDraft"
            @next="nextStep"
            @prev="prevStep"
            @publish="stageProposal"
            @refer="refer"
            @select="select"
            v-bind="stepProps"
          )
      .col-3.q-pl-md
        creation-stepper(
          :activeStepIndex="stepIndex"
          :steps="stepsBasedOnSelection"
          @goToStep="goToStep"
          @publish="stageProposal"
          @save="saveDraft(true)"
        )
          template(#cta)
            q-btn.q-my-sm.q-px-sm.full-width(
              :class="!lastStep ? 'btn-primary-disabled' : 'btn-primary-active'"
              :disabled="!lastStep"
              label="Publish to staging"
              no-caps
              rounded
              unelevated
            )
  template(v-if="$q.platform.is.mobile")
    confirm-action-modal(
      v-model="confirmLeavePage"
      @responded="onLeavePageConfirmed"
      title="Are you sure you want to leave without saving your draft?"
    )
      template(v-slot:buttons-actions)
        .row.q-mt-sm.q-col-gutter-md.justify-end
          .col 
            .col
              q-btn.full-width.q-mb-sm(
                no-caps
                label="Leave without saving"
                flat
                rounded
                color="primary"
                @click="onLeavePageConfirmed(true)"
              )
            .col
              q-btn.full-width(
                no-caps
                label="Save draft and leave"
                rounded
                color="primary"
                @click="onLeavePageConfirmed(false)"
              )
    .full-height.full-width.fixed-full.bg-internal-bg(:style="'padding: 15px; overflow-y: scroll; z-index: 7777;'")
      .flex.row.justify-between
        q-btn(unelevated rounded padding="12px" icon="fas fa-arrow-left"  size="sm" :color="'white'" text-color="'primary'" @click="prevStep")
        .h-h6.text-bold.flex.items-center {{'New proposal'}}
        q-btn(unelevated rounded padding="12px" icon="fas fa-times"  size="sm" :color="'white'" text-color="'primary'" :to="{ name: 'dashboard'}")
        q-card.main-card(:style="'border-radius: 25px; box-shadow: none; margin-top: 15px; width: 100%;'")
          component(
            :is="stepsBasedOnSelection[stepIndex].component"
            :stepIndex="stepIndex"
            :steps="stepsBasedOnSelection"
            @save="saveDraft(true)"
            @continue="continueDraft"
            @delete="deleteDraft"
            @next="nextStep"
            @prev="prevStep"
            @publish="stageProposal"
            @refer="refer"
            @select="select"
            v-bind="stepProps"
          )
</template>
<style lang="stylus" scoped>
.main-card
  margin-bottom: 270px !important
</style>

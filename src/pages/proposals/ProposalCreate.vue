<script>
import CONFIG from './create/config.json'

export default {
  name: 'proposal-create',
  components: {
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepCompensation: () => import('./create/StepCompensation.vue'),
    StepDateDuration: () => import('./create/StepDateDuration.vue'),
    StepDescription: () => import('./create/StepDescription.vue'),
    StepProposalType: () => import('./create/StepProposalType.vue'),
    StepReview: () => import('./create/StepReview.vue'),
    StepIcon: () => import('./create/StepIcon.vue')
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
      draft: null,
      selection: null, // The key of the selected option from the config
      reference: null,
      stepIndex: 0
    }
  },

  computed: {
    stepProps () {
      return {
        config: this.config,
        draft: this.draft,
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

  mounted () {
    // Check for drafts in localStorage
    const draftString = localStorage.getItem('proposal-draft')
    if (draftString) {
      this.draft = JSON.parse(draftString)
    }
  },

  methods: {
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
    },

    deleteDraft () {
      localStorage.removeItem('proposal-draft')
      this.draft = null
    },

    publishProposal () {
      this.$store.dispatch('proposals/publishProposal')
    }
  }
}
</script>

<template lang="pug">
.proposal-create
  .text-h6.text-bold.q-mb-md(v-if="selectedConfig") Create New Proposal
    span.text-h6.text-bold(v-if="selectedConfig && selectedConfig.title")  - {{ selectedConfig.title }}
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
        @save="saveDraftProposal"
        @publish="publishProposal"
      )
</template>

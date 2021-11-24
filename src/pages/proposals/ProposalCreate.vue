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
    StepReview: () => import('./create/StepReview.vue')
  },

  data () {
    return {
      // Freeze the config to disable reactivity (performance)
      config: Object.freeze(CONFIG),
      drafts: [
        {
          title: 'Bridge - Assignment Lorem - Jan 32 to Dec 62',
          subtitle: 'Subtitle',
          category: 'Bridge',
          dirty: true
        }
      ],
      proposal: {},
      selection: '',
      stepIndex: 0
    }
  },

  computed: {
    stepProps () {
      return {
        config: this.config,
        drafts: this.drafts,
        proposal: this.proposal,
        selection: this.selection,
        stepIndex: this.stepIndex
      }
    },

    // TODO: Dedupe this code (also in step components)
    top () {
      return this.selection.split(':')[0]
    },

    sub () {
      const selects = this.selection.split(':')
      if (selects.length > 1) {
        return selects[1]
      }
      return null
    }
  },

  mounted () {
    // Check for drafts in localStorage
    const draftString = localStorage.getItem('proposal-drafts')
    if (draftString) {
      this.drafts = JSON.parse(draftString)
    }
  },

  methods: {
    gotoStep (key) {
      this.stepIndex = this.config.steps.findIndex(s => s.key === key)
    },

    nextStep () {
      this.stepIndex += 1
    },

    prevStep () {
      this.stepIndex -= 1
    },

    select (option) {
      this.selection = option
    },

    update (updated) {
      this.proposal = Object.assign({}, this.proposal, updated)
    },

    continueDraft (draft) {
      this.update(draft)
      this.nextStep()
    },

    deleteDraft (draft) {

    }
  }
}
</script>

<template lang="pug">
.proposal-create
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      component(
        :is="config.steps[stepIndex].component"
        v-bind="stepProps"
        @select="select"
        @next="nextStep"
        @prev="prevStep"
        @continue="continueDraft"
        @delete="deleteDraft"
      )

    .col-3.q-pl-sm
      creation-stepper(
        :steps="config.steps"
        :stepIndex="stepIndex"
        @goto="gotoStep"
      )
</template>

<script>
import { mapActions } from 'vuex'
import CONFIG from './create/config.js'
import { PROPOSAL_TYPE, MEMBER_TYPE } from '~/const'

const DEFAULT_PAST_STEPS = ['step-proposal-type']
const DEFAULT_CURRENT_STEP_NAME = 'step-proposal-type'
const DEFAULT_STEP_INDEX = 0

export default {
  name: 'proposal-create',
  components: {
    ConfirmActionModal: () => import('~/components/common/confirm-action-modal.vue'),
    CreationStepper: () => import('~/components/proposals/creation-stepper.vue'),
    StepDetails: () => import('./create/StepDetails.vue'),
    StepDuration: () => import('./create/StepDuration.vue'),
    StepIcon: () => import('./create/StepIcon.vue'),
    StepPayout: () => import('./create/StepPayout.vue'),
    StepProposalType: () => import('./create/StepProposalType.vue'),
    StepReview: () => import('./create/StepReview.vue'),

    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },

  props: {
    // TODO: Props should include route parameters
    // this will allow back button in creation wizard
    // step: String? - used to calculate stepIndex
    // type: String? - replaces selection in data
  },

  data () {
    return {
      PROPOSAL_TYPE,
      // Freeze the config to disable reactivity (performance)
      config: Object.freeze(CONFIG),
      drafts: null,
      selection: null, // The key of the selected option from the config
      reference: null,
      // stepIndex: 0,
      confirmLeavePage: null,
      next: null,
      pastSteps: ['step-proposal-type'],
      currentStepName: 'step-proposal-type',
      loadStepsSpinner: false,
      memberType: localStorage.getItem('memberType')
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
        stepIndex: this.stepIndex,
        disablePrevButton: false,
        currentStepName: this.currentStepName
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
      const options = this.memberType === MEMBER_TYPE.COMMUNITY ? this.config.types.community.options : this.memberType === MEMBER_TYPE.CORE ? this.config.types.core.options : this.config.options
      if (this.selection) {
        if (options[this.selection]) {
          return options[this.selection]
        }

        let result = null
        let found = false
        Object.values(options).forEach((opt) => {
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
      // this.$store.commit('proposals/reset')
      next()
    }
  },
  activated () {
    // Check for drafts in localStorage
    this.resetStates()
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
        const draftId = this.$route.params.draftId
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
        if (draftId) {
          const draft = drafts.find(d => d.draftId === draftId)
          if (draft.type === 'Assignment Badge') this.reference = draft.badge
          if (draft.type === 'Role assignment') this.reference = draft.role
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

    scrollToNextStep (nextStep) {
      if (!this.pastSteps.includes(nextStep)) {
        this.pastSteps.push(nextStep)
      }
      const checkingElement = window.setInterval(() => {
        this.loadStepsSpinner = true
        if (document.getElementById(nextStep)) {
          this.loadStepsSpinner = false
          clearInterval(checkingElement)
          setTimeout(() => { document.getElementById(nextStep).scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 100)
        }
      }, 100)
    },

    nextStep () {
      this.stepIndex += 1
      while (this.stepsBasedOnSelection[this.stepIndex].skip) {
        this.stepIndex += 1
      }
      this.currentStepName = this.stepsBasedOnSelection[this.stepIndex].component
      // this.$router.replace({ ...this.$router.currentRoute.path, query: { temp: Date.now() } })
      if (this.$q.screen.gt.md) {
        this.scrollToNextStep(this.stepsBasedOnSelection[this.stepIndex].component)
      }
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
          // this.$router.replace({ query: { temp: Date.now() } })
        }
        if (this.$q.screen.gt.md) {
          this.currentStepName = this.stepsBasedOnSelection[this.stepIndex].component
          this.scrollToNextStep(this.stepsBasedOnSelection[this.stepIndex].component)
        }
      }
    },

    goToStep ({ index, stepName }) {
      this.currentStepName = stepName
      this.stepIndex = index
      if (this.$q.screen.gt.md) {
        this.scrollToNextStep(stepName)
      }
    },

    select (option) {
      this.pastSteps = ['step-proposal-type']
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
      if (this.selectedConfig.type === PROPOSAL_TYPE.ABILITY) {
        this.$store.commit('proposals/setBadge', this.reference)
        this.$store.commit('proposals/setRewardCoefficientLabel', (this.reference.details_rewardCoefficientX10000_i) / 10000)
        this.$store.commit('proposals/setRewardCoefficient', this.reference.details_rewardCoefficientX10000_i)
        this.$store.commit('proposals/setVoiceCoefficientLabel', (this.reference.details_voiceCoefficientX10000_i) / 10000)
        this.$store.commit('proposals/setVoiceCoefficient', this.reference.details_voiceCoefficientX10000_i)
        this.$store.commit('proposals/setPegCoefficientLabel', (this.reference.details_pegCoefficientX10000_i) / 10000)
        this.$store.commit('proposals/setPegCoefficient', this.reference.details_pegCoefficientX10000_i)
        this.$store.commit('proposals/setIcon', this.reference.details_icon_s)
      } else if (this.selectedConfig.type === PROPOSAL_TYPE.POLICY) {
        if (this.reference.value !== '') {
          this.$store.commit('proposals/setMasterPolicy', this.reference)
        } else {
          this.$store.commit('proposals/setMasterPolicy', null)
        }
      }
    },

    continueDraft (draft) {
      if (draft.category) {
        this.selection = draft.category.key
        // TODO: Go to next step if selection is done?
        // this.nextStep()
      }
      if (draft.pastSteps) {
        this.pastSteps = draft.pastSteps
        this.currentStepName = draft.pastSteps[draft.pastSteps.length - 1]
      } else {
        if (draft.stepIndex === 1) {
          this.$route.meta.title = 'Edit Proposal'
        }
        this.pastSteps = this.stepsBasedOnSelection.filter(_ => !_.skip).map(_ => _.component)
        this.currentStepName = this.pastSteps[draft.stepIndex]
      }

      this.$store.dispatch('proposals/continueDraft', draft)

      const checkingElement = window.setInterval(() => {
        if (document.getElementById(this.currentStepName)) {
          this.loadStepsSpinner = false
          clearInterval(checkingElement)
          setTimeout(() => { document.getElementById(this.currentStepName).scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 400)
        }
      }, 100)
    },

    saveDraft () {
      this.$store.commit('proposals/setPastSteps', this.pastSteps)
      this.draft = { ...this.$store.state.proposals.draft }
      this.$store.dispatch('proposals/saveDraft')
      this.showNotification({
        message: 'Draft saved successfully'
      })
    },

    deleteDraft (draft) {
      this.removeDraft(draft)
      if (!draft.draftId) {
        this.resetStates()
      }
      this.getDraft()
      // this.draft = null
    },

    resetStates () {
      this.pastSteps = DEFAULT_PAST_STEPS
      this.currentStepName = DEFAULT_CURRENT_STEP_NAME
      this.stepIndex = DEFAULT_STEP_INDEX
      this.selection = null
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

        this.$router.push({ name: 'agreements', params: { data }, query: { refetch: true } })

        // setTimeout(() => this.$router.push({ name: 'agreements', query: { data, refetch: true } }), 700)
      } catch (e) {
        const message = e.message || e.cause.message
        // this.saveDraft()
        this.showNotification({
          message,
          color: 'red'
        })
      }
    }
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
  confirm-action-modal(v-model="confirmLeavePage" @responded="onLeavePageConfirmed" :title="$t('pages.proposals.proposalcreate.areYouSure')")
    template(v-slot:buttons-actions)
      .row.q-mt-sm.q-col-gutter-md.justify-end
        .col-10
          .row
            .col
              q-btn.full-width(no-caps :label="$t('pages.proposals.proposalcreate.leaveWithoutSaving')" flat rounded color="primary" @click="onLeavePageConfirmed(true)")
            .col
              q-btn.full-width(no-caps :label="$t('pages.proposals.proposalcreate.saveDraftAndLeave')" rounded color="primary" @click="onLeavePageConfirmed(false)")
  template(v-if="$q.screen.gt.md")
    .row.full-width.q-my-md.q-mt-lg
      .col-9
        template(v-for="step in stepsBasedOnSelection")
          component(:class="{'disable-step': currentStepName !== step.component, 'q-mt-md': step.component != 'step-proposal-type', 'ghost-margin-bottom': step.component === pastSteps.slice(-1)[0] }" v-if="pastSteps.includes(step.component)" :is="step.component" :stepIndex="stepIndex" :steps="stepsBasedOnSelection" :id="step.component" :type="$store.state.proposals.draft.type" :memberType="memberType" @save="saveDraft(true)" @continue="continueDraft" @delete="deleteDraft" @next="nextStep" @prev="prevStep" @publish="stageProposal" @refer="refer" @select="select" v-bind="stepProps")
        .flex.items-center.justify-center.q-py-xl(v-if="loadStepsSpinner")
          loading-spinner(color="primary" size="60px")
      .col-3.q-pl-md
        creation-stepper.sticky(:activeStepIndex="stepIndex" :steps="stepsBasedOnSelection" @goToStep="goToStep" @publish="stageProposal" @save="saveDraft(true)")
          template(#cta)
            q-btn.q-my-sm.q-px-sm.full-width(:class="!lastStep ? 'btn-primary-disabled' : 'btn-primary-active'" :disabled="!lastStep" @click="stageProposal" :label="$store.state.proposals.draft.edit ? 'Publish' : 'Publish to staging'" no-caps rounded unelevated)
  template(v-if="$q.screen.lt.md || $q.screen.md")
    .full-height.full-width.fixed-full.bg-internal-bg(:style="'padding: 15px; overflow-y: scroll; z-index: 7777;'")
      .flex.row.justify-between
        q-btn(unelevated rounded padding="12px" icon="fas fa-arrow-left" size="sm" :color="'white'" text-color="'primary'" @click="prevStep")
        .h-h6.text-bold.flex.items-center {{'New proposal'}}
        .relative
          q-btn(unelevated rounded padding="12px" icon="fas fa-times" size="sm" :color="'white'" text-color="'primary'" :to="{ name: 'dashboard'}")
          q-btn.absolute(@click="saveDraft(true)" :disabled="!this.$store.state.proposals.draft.title" unelevated rounded padding="12px" icon="fas fa-arrow-down" size="sm" :color="'white'" text-color="primary" :style="{ 'right': '65px' }")
        q-card.main-card(:style="'border-radius: 25px; box-shadow: none; margin-top: 15px; width: 100%;'")
          component(:is="stepsBasedOnSelection[stepIndex].component" :stepIndex="stepIndex" :steps="stepsBasedOnSelection" :memberType="memberType" @save="saveDraft(true)" @continue="continueDraft" @delete="deleteDraft" @next="nextStep" @prev="prevStep" @publish="stageProposal" @refer="refer" @select="select" v-bind="stepProps")

</template>

<style lang="stylus" scoped>
.main-card
  margin-bottom: 270px !important
.ghost-margin-bottom
  margin-bottom: 20%
</style>

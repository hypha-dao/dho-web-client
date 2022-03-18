<script>
/**
 * Control for navigating the proposal creation wizard
 */
export default {
  name: 'creation-stepper',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    /**
     * The current active step
     */
    stepIndex: Number,
    /**
     * An array of objects containing the steps
     * including a label and key
     */
    steps: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    filteredSteps () {
      return this.steps.filter(s => !s.skip)
    },
    currentStepKey () {
      return this.steps[this.stepIndex].key
    }
  }
}
</script>

<template lang="pug">
widget(title="Creation process")
  q-list
    template(v-for="(s, i) in filteredSteps")
      //- q-item(clickable v-ripple :key="s.key" @click="$emit('goto', s.key)")
      q-item(:key="s.key")
        q-item-section(avatar)
          // q-avatar(color="white" text-color="disabled") {{ i + 1 }}
          q-btn(v-if="stepIndex === s.index-1" round unelevated color="primary") {{ i + 1 }}
          q-btn(v-else outline round unelevated color="disabled" :ripple="false") {{ i + 1 }}
        q-item-section.text-subtitle1(:class="{ 'text-bold': stepIndex === i }") {{ s.label }}
  q-btn.q-mt-lg.q-px-sm.full-width(rounded :disabled="!this.$store.state.proposals.draft.title" outline color="primary" no-caps @click="$emit('save')") Save as draft
  q-btn.q-my-sm.q-px-sm(:disabled="currentStepKey !== 'review'" rounded unelevated :class="currentStepKey !== 'review' ? 'btn-primary-disabled' : 'btn-primary-active'" no-caps @click="$emit('publish')").full-width Publish
</template>

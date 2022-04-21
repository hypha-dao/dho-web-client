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
  .q-mt-xxxl
  q-list
    template(v-for="(s, i) in filteredSteps")
      //- q-item(clickable v-ripple :key="s.key" @click="$emit('goto', s.key)")
      q-item(:key="s.key")
        q-item-section(avatar)
          .row.items-center.justify-center
            // q-avatar(color="white" text-color="disabled") {{ i + 1 }}
            q-btn(v-if="stepIndex === s.index-1" round unelevated color="primary") {{ i + 1 }}
            q-btn(v-else-if="stepIndex > s.index-1" outline round unelevated color="primary" text-color="primary" icon="fas fa-check" @click="$emit('goToStep', i)")
            q-btn(v-else outline round unelevated disabled color="disabled" :ripple="false") {{ i + 1 }}
            q-item-section.text-subtitle1.q-ml-xl(:class="{ 'text-bold': stepIndex === i }") {{ s.label }}
          .row.justify-start.full-width
            .separator(v-if="s.label !== 'Review'")
  q-btn.q-mt-xxxl.q-px-sm.full-width(rounded :disabled="!this.$store.state.proposals.draft.title" outline color="primary" no-caps @click="$emit('save')") Save as draft
  q-btn.q-my-sm.q-px-sm(:disabled="currentStepKey !== 'review'" rounded unelevated :class="currentStepKey !== 'review' ? 'btn-primary-disabled' : 'btn-primary-active'" no-caps @click="$emit('publish')").full-width Publish
</template>

<style lang="stylus" scoped>
.separator
  margin-left: 18px
  height: 40px
  width: 2px
  background: $primary
.q-item
  padding: 0px
.q-item__section--avatar
  min-width: 0px
</style>

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
    activeStepIndex: Number,
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
    filteredSteps () { return this.steps.filter(s => !s.skip) },
    lastStep () { return this.activeStepIndex === this.filteredSteps.length - 1 },
    hasSaveListener () { return this.$listeners && this.$listeners.save },
    hasPublishListener () { return this.$listeners && this.$listeners.publish }
  }
}
</script>

<template lang="pug">
widget(title="Creation process")
  q-list().q-pt-md.wizard
    template(v-for="(step, index) in filteredSteps")
      q-item(:key="index" ).q-py-md.q-px-none.wizard-item
        q-item-section(avatar)
          transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            span(v-show='activeStepIndex > index').wizard-item-line
          div(:class="activeStepIndex === index && 'active'").text-bold.wizard-item-icon
            span(v-show='activeStepIndex <= index') {{ index + 1 }}
            q-icon(v-show='activeStepIndex > index' center size='10px' name="fas fa-check")
        q-item-section
          div(:class="activeStepIndex === index && 'text-bold text-primary'").text-body2.q-pl-sm {{ step.label }}
          //- q-btn(v-else-if="stepIndex > s.index-1" outline round unelevated color="primary" text-color="primary" icon="fas fa-check" @click="$emit('goToStep', i)")
  q-btn.q-mt-xxxl.q-px-sm.full-width(
    :disabled="!this.$store.state.proposals.draft.title"
    @click="$emit('save')"
    color="primary"
    label="Save as draft"
    no-caps
    outline
    rounded
    v-if="hasSaveListener"
  )
  q-btn.q-my-sm.q-px-sm.full-width(
    :class="!lastStep ? 'btn-primary-disabled' : 'btn-primary-active'"
    :disabled="!lastStep"
    @click="$emit('publish')"
    label="Publish"
    no-caps
    rounded
    unelevated
    v-if="hasPublishListener"
  )
</template>

<style lang="stylus" scoped>
.wizard-item
  position: relative;
  z-index: 10;

.wizard-item-line
  height: 99%;
  border: 2px solid #242f5d;
  position: absolute;
  top: 1em;
  margin-top: .5em;
  z-index: 1;
  margin-left: 13px;

.wizard-item-icon
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 1000;
  background-color: white;
  color: var(--q-color-primary);
  border: 1px solid var(--q-color-primary) !important;

.wizard-item-icon.active
  background-color: white;
  background-color: var(--q-color-primary) ;
  color: white;
</style>

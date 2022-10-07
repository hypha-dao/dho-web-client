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
    nextDisabled: Boolean,
    steps: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    filteredSteps () { return this.steps.filter(s => !s.skip) },
    hasPublishListener () { return this.$listeners && this.$listeners.publish },
    hasSaveListener () { return this.$listeners && this.$listeners.save },
    lastStep () { return this.activeStepIndex === this.filteredSteps[this.filteredSteps.length - 1].index - 1 },
    hasCTA () { return this.$slots.cta !== undefined }
  }
}
</script>

<template lang="pug">
widget(title="Creation process")
  q-list(:class="{ 'q-pt-md':$q.platform.is.desktop }").wizard
    template(v-if="$q.platform.is.desktop" v-for="(step, index) in filteredSteps")
      q-item(:key="index").q-py-md.q-px-none.wizard-item
        q-item-section(avatar)
          transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            span(v-show='activeStepIndex > step.index - 1').wizard-item-line
          div(:class=" {'cursor-pointer': activeStepIndex > index-1, 'active': activeStepIndex === step.index - 1 }" @click=" activeStepIndex > index-1 && $emit('goToStep', index)").text-bold.wizard-item-icon
            span.number-text(v-show='activeStepIndex <= step.index - 1') {{ index + 1 }}
            q-icon(v-show='activeStepIndex > step.index - 1' center size='10px' name="fas fa-check")
        q-item-section
          div(:class="{ 'cursor-pointer': activeStepIndex > index-1, 'selected-label-text text-primary': activeStepIndex === step.index - 1 }" @click="activeStepIndex > index-1 && $emit('goToStep', index)").label-text.q-pl-sm {{ step.label }}
    template(v-if="$q.platform.is.mobile" v-for="(step, index) in filteredSteps")
      q-item(v-if="activeStepIndex === step.index - 1" :key="index").q-py-sm.q-px-none.wizard-item
        q-item-section(avatar)
          transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            span(v-show='activeStepIndex > step.index - 1').wizard-item-line
          div(:class=" {'cursor-pointer': activeStepIndex > index-1, 'active': activeStepIndex === step.index - 1 }" @click=" activeStepIndex > index-1 && $emit('goToStep', index)").text-bold.wizard-item-icon
            span.number-text(v-show='activeStepIndex <= step.index - 1') {{ index + 1 }}
            q-icon(v-show='activeStepIndex > step.index - 1' center size='10px' name="fas fa-check")
        q-item-section
          div(:class="{ 'cursor-pointer': activeStepIndex > index-1, 'selected-label-text text-primary': activeStepIndex === step.index - 1 }" @click="activeStepIndex > index-1 && $emit('goToStep', index)").label-text.q-pl-sm {{ step.label }}
  q-btn.q-px-sm.full-width(
    :class="{ 'q-mt-xxxl':$q.platform.is.desktop }"
    :disabled="!this.$store.state.proposals.draft.title"
    @click="$emit('save')"
    color="primary"
    label="Save as draft"
    no-caps
    outline
    rounded
    v-if="hasSaveListener"
  )
  q-btn.q-mt-sm.q-px-sm.full-width(
    :class="nextDisabled? 'btn-primary-disabled': 'btn-primary-active'"
    :disable="nextDisabled"
    @click="$emit('next')"
    color="primary"
    label="Next step"
    no-caps
    rounded
    unelevated
    v-if="$q.platform.is.mobile && !lastStep"
  )
  slot(name="cta")
  q-btn.q-mt-sm.q-px-sm.full-width(
    v-show="!hasCTA"
    :class="!lastStep ? 'btn-primary-disabled' : 'btn-primary-active'"
    :disabled="!lastStep"
    @click="$emit('publish')"
    label="Publish"
    no-caps
    rounded
    unelevated
    v-if="hasPublishListener && lastStep"
  )
</template>

<style lang="stylus" scoped>
.selected-label-text
  font-family: "Lato Black", sans-serif !important
.label-text
  font-size: 15px
  font-family: "Lato", sans-serif
.number-text
  font-size: 11px
  font-family: "Lato Black", sans-serif
.wizard-item
  position: relative;
  z-index: 10;

.wizard-item-line
  height: 99%;
  border: 1px solid #242f5d;
  position: absolute;
  top: 1em;
  margin-top: .5em;
  z-index: 1;
  margin-left: 14px;

.wizard-item-icon
  width: 31px;
  height: 31px;
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

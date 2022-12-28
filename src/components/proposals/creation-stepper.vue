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
widget(
  title="Creation process"
  :noTitle="!$q.screen.gt.md"
)
  q-list(:class="{ 'q-pt-md':$q.screen.gt.md }").wizard
    template(v-if="$q.screen.gt.md" v-for="(step, index) in filteredSteps")
      q-item.q-py-md.q-px-none.wizard-item
        q-item-section(avatar)
          transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            span(v-show='activeStepIndex > step.index - 1').wizard-item-line
          div(:class=" {'cursor-pointer': activeStepIndex > index-1, 'active': activeStepIndex === step.index - 1 }" @click=" activeStepIndex > index-1 && $emit('goToStep', { index: step.index - 1, stepName: step.component })").text-bold.wizard-item-icon
            span.number-text(v-show='activeStepIndex <= step.index - 1') {{ index + 1 }}
            q-icon(v-show='activeStepIndex > step.index - 1' center size='10px' name="fas fa-check")
        q-item-section
          div(:class="{ 'cursor-pointer': activeStepIndex > index-1, 'selected-label-text text-primary': activeStepIndex === step.index - 1 }" @click="activeStepIndex > index-1 && $emit('goToStep', { index: step.index - 1, stepName: step.component })").label-text.q-pl-sm {{ step.label }}
  div.flex.full-width.justify-between
    div.flex.items-center(:class="{ 'full-width':!$q.screen.sm }")
      q-btn.q-px-sm(
        :class="{ 'q-mt-xxxl':$q.screen.gt.md, 'full-width':!$q.screen.sm, 'q-mr-xs':$q.screen.sm }"
        :disabled="!this.$store.state.proposals.draft.title"
        @click="$emit('save')"
        color="primary"
        label="Save as draft"
        no-caps
        outline
        rounded
        v-if="hasSaveListener && $q.screen.gt.md"
      )
      .flex.items-center.justify-between.row.full-width(v-if="!$q.screen.gt.md" :style="{ 'flex-direction': 'row', 'margin-bottom': '40px' }")
        .flex.row.justify-center(v-if="!$q.screen.sm")
          template(v-if="$q.screen.lt.md || $q.screen.md" v-for="(step, index) in filteredSteps")
            div(:class="{ 'active-dot':activeStepIndex === step.index - 1, 'upcoming-dot':activeStepIndex < step.index - 1 }" style="width: 10px; height: 10px; border-radius: 100%; border: 1px solid #242F5D; margin: 0 7.5px;")
        q-btn.q-px-sm(
          :class="{ 'btn-primary-disabled': nextDisabled, 'btn-primary-active': !nextDisabled, 'full-width q-mt-sm': $q.screen.gt.md }"
          :disable="nextDisabled"
          @click="$emit('next')"
          color="primary"
          label="Next step"
          no-caps
          rounded
          unelevated
          v-if="($q.screen.lt.md || $q.screen.md) && !lastStep"
        )
        slot(name="cta")
        q-btn.q-px-sm(
          v-show="!hasCTA"
          :class="{ 'btn-primary-disabled': !lastStep, 'btn-primary-active': lastStep, 'full-width q-mt-sm': $q.screen.gt.md }"
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

.active-dot
  background: #242F5D;

.upcoming-dot
  border: none !important;
  background: #F1F1F1;
</style>

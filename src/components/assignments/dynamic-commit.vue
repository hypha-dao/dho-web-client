<script>
/**
 * Slider to adjust the commitment on an assignment.
 */
export default {
  name: 'dynamic-commit',

  props: {
    /**
     * An object containing the range and value of the commitment values
     */
    commit: {
      type: Object,
      default: () => {
        return { value: 100, min: 0, max: 100 }
      },
      validator: (val) => {
        return val.min >= 0 &&
               val.min <= val.value &&
               val.value <= val.max &&
               val.max <= 100
      }
    },
    /**
     * An object containing the range and value of the deferred values
     */
    deferred: {
      type: Object,
      default: () => {
        return { value: 100, min: 0, max: 100 }
      },
      validator: (val) => {
        return val.min >= 0 &&
               val.min <= val.value &&
               val.value <= val.max &&
               val.max <= 100
      }
    },
    /**
     * Whether we are processing a change action
     */
    submitting: Boolean
  },

  data () {
    return {
      newCommit: this.commit.value,
      newDeferred: this.deferred.value
    }
  },

  methods: {
    onSubmit () {
      if (this.newCommit !== this.commit.value) {
        this.$emit('change-commit', this.newCommit)
      }

      if (this.newDeferred !== this.deferred.value) {
        this.$emit('change-deferred', this.newDeferred)
      }
    }
  }
}
</script>

<template lang="pug">
.q-py-sm.q-col-gutter-xs
  .col-12.text-body2 Adjustments to your assignment do not require a vote.
  .col-12.q-px-md(@click.stop)
    // .row.text-caption.items-center.justify-between.q-mt-md.q-mb-lg
    .text-caption.q-mt-md.q-mb-lg
      .text-bold.on-left COMMITMENT
      .text-grey-7 Choose between {{ commit.min }}% and {{ commit.max}}%
    q-slider(
      v-model="newCommit"
      :min="commit.min"
      :max="commit.max"
      :step="5"
      :label-value="newCommit + '%'"
      :disable="submitting"
      label-always
      :color="newCommit === commit.value ? 'primary' : 'positive'"
    )
    .text-body2 Multiple adjustments to your commitment will be included in the calculation.
  .col-12.q-mt-md.q-px-md(@click.stop)
    .text-caption.q-mt-md.q-mb-lg
      .text-bold.on-left DEFERRAL
      .text-grey-7 Choose between {{ deferred.min }}% and {{ deferred.max}}%
    q-slider(
      v-model="newDeferred"
      :min="deferred.min"
      :max="deferred.max"
      :step="1"
      :label-value="newDeferred + '%'"
      :disable="submitting"
      label-always
      :color="newDeferred === deferred.value ? 'primary' : 'negative'"
    )
    .text-body2 This deferral rate is only applied at the time you make a claim.
  .col-12.q-mt-md
    q-btn.full-width(
      rounded
      unelevated
      :color="(newCommit === commit.value && newDeferred === deferred.value) ? 'grey-5' : 'positive'"
      :disable="(newCommit === commit.value && newDeferred === deferred.value) || submitting"
      :loading="submitting"
      @click.stop="onSubmit"
    ) Confirm
</template>

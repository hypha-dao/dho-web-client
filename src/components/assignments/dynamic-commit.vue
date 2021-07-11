<script>
/**
 * Slider to adjust the commitment on an assignment.
 */
export default {
  name: 'dynamic-commit',

  props: {
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
    submitting: Boolean
  },

  data () {
    return {
      newCommit: this.commit.value
    }
  }
}
</script>

<template lang="pug">
.q-py-sm.q-col-gutter-md
  .col-12.text-body2 If you adjust your assignment, your % commitment will be immediately reflected on your next claim (no vote is necessary). Multiple adjustments during the same claim period will be included in the calculation.
  .col-12.q-mt-md.q-px-md(@click.stop)
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
    // .row.text-caption.justify-between
      span {{ commit.min + '%' }}
      span {{ commit.max + '%' }}
  .col-12
    q-btn.full-width(
      rounded
      unelevated
      :color="newCommit === commit.value ? 'grey-5' : 'positive'"
      :disable="newCommit === commit.value || submitting"
      :loading="submitting"
      @click.stop="$emit('change-commit', newCommit)"
    ) Confirm
</template>

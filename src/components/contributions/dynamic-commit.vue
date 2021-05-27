<script>
/**
 * Slider to adjust the commitment on an assignment.
 */
export default {
  name: 'dynamic-commit',
  props: {
    commit: {
      type: Object,
      default: function () {
        return { value: 100, min: 0, max: 100 }
      },
      validator: function (val) {
        return val.min >= 0 &&
               val.min <= val.value &&
               val.value <= val.max &&
               val.max <= 100
      }
    }
  },
  data () {
    return {
      newCommit: this.commit.value
    }
  }
}
</script>

<template lang="pug">
.q-pa-sm
  .row.q-mt-md.q-px-md
    q-slider(
      v-model="newCommit"
      :min="commit.min"
      :max="commit.max"
      :step="5"
      label
      :label-value="newCommit + '%'"
      label-always
      color="primary"
    )
  .row.text-caption.justify-between
    span {{ commit.min + '%' }}
    span {{ commit.max + '%' }}
</template>

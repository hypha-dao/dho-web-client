<script>
import { format } from '~/mixins/format'

export default {
  name: 'salary',
  mixins: [format],
  components: {
    DynamicCommit: () => import('./dynamic-commit.vue'),
    PayoutAmounts: () => import('../common/payout-amounts.vue')
  },

  props: {
    active: Boolean,
    assignment: Boolean,
    owner: Boolean,
    tokens: {
      type: Array,
      default: () => []
    },
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
      monthly: false
    }
  },

  computed: {
    salaryCommitted () {
      if (this.commit.value < this.commit.max) {
        return `${this.commit.value}% (Max ${this.commit.max}%)`
      }
      return `${this.commit.value}%`
    }
  }
}
</script>

<template lang="pug">
.salary.row.q-pa-md(@click.stop)
  .col-12.q-pa-md(:class="{ 'col-lg-6': owner && active }")
    .text-bold.q-mb-md COMPENSATION
    payout-amounts(:tokens="tokens" :multiplier="monthly ? 4 : 1")
    .row.items-center.justify-between.q-mt-sm(v-if="assignment")
      .lunar-toggle.text-italic Show tokens for a full lunar cycle (ca. 1 month)
      q-toggle(v-model="monthly")
  .col-12.col-lg-6.q-pa-md(v-if="owner && active")
    .text-bold.q-mb-md COMMITMENT
    dynamic-commit(
      :commit="commit"
      :submitting="submitting"
      @change-commit="val => $emit('change-commit', val)")
</template>

<style lang="stylus" scoped>
.salary-info
  border-radius 24px
  background-color #F6F6F7

  .lunar-toggle
    max-width 70%
</style>

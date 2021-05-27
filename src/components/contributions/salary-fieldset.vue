<script>
import { format } from '~/mixins/format'

export default {
  name: 'salary-fieldset',
  mixins: [format],
  components: {
    DynamicCommit: () => import('./dynamic-commit.vue'),
    PayoutAmounts: () => import('./payout-amounts.vue')
  },

  props: {
    tokens: {
      type: Array,
      default: () => []
    },
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
    },
    deferred: {
      type: Number,
      validator: function (val) {
        return val >= 0 && val <= 100
      }
    },
    usdEquivalent: {
      type: Number
    }
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
    },
    salaryDeferred () {
      return `${this.deferred}%`
    }
  }
}
</script>

<template lang="pug">
fieldset.q-mt-sm
  legend Salary
  p Fields below display the payout of this assignment for a {{ this.monthly ? 'full lunar cycle (ca. 1 month)' : 'single lunar period (ca. 1 week)' }} as well as % committed and % deferred. The payout is shown as USD equivalent and the corresponding amounts in SEEDS, HVOICE, HYPHA and HUSD.
  .row.q-col-gutter-xs
    .col-12
      dynamic-commit(:commit="commit")
    .col-xs-12.col-md-6
      q-input.bg-grey-4.text-black(
        v-model="salaryCommitted"
        outlined
        dense
        readonly
      )
      .hint Committed
    .col-xs-12.col-md-6
      q-input.bg-grey-4.text-black(
        v-model="salaryDeferred"
        outlined
        dense
        readonly
      )
      .hint Deferred
  .row.q-my-sm
    strong SALARY CALCULATION (BASED ON USD EQUIVALENT OF USD {{ usdEquivalent }})
  .row.q-col-gutter-xs
    payout-amounts(:tokens="tokens" :multiplier="monthly ? 4 : 1")
  .row
    q-toggle(v-model="monthly" label="Show tokens for a full lunar cycle (ca. 1 month)")
</template>

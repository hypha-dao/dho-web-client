<script>
export default {
  name: 'step-compensation',
  components: {
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    config: Object,
    proposal: Object,
    selection: String,
    stepIndex: Number
  },

  data () {
    return {
      form: {
        husd: 0,
        hvoice: 0,
        hypha: 0
      },
      custom: false,
      usdAmount: this.proposal.usdAmount,
      deferred: this.proposal.deferred
    }
  },

  watch: {
    custom: {
      handler (val) {
        if (!val) {
          this.calculateTokens()
        }
      }
    },
    usdAmount: {
      immediate: true,
      handler (val) {
        this.calculateTokens()
      }
    },
    deferred: {
      immediate: true,
      handler (val) {
        this.calculateTokens()
      }
    }
  },

  computed: {
    fields () {
      const result = Object.assign({}, this.config.fields)
      const topOption = this.config.options[this.top]
      if (topOption) {
        Object.assign(result, topOption.fields)
        const subOption = topOption.options[this.sub]
        if (subOption) {
          Object.assign(result, subOption.fields)
        }
      }
      // Filter options to just this step
      return Object.values(result).filter(f => f.step === this.stepKey)
    },

    stepKey () {
      return this.config.steps[this.stepIndex].key
    },

    top () {
      return this.selection.split(':')[0]
    },

    sub () {
      const selects = this.selection.split(':')
      if (selects.length > 1) {
        return selects[1]
      }
      return null
    },

    tokens () {
      return [
        {
          key: 'husd',
          label: 'Husd',
          icon: 'husd.svg',
          value: this.form.husd
        },
        {
          key: 'hvoice',
          label: 'HVoice',
          icon: 'hvoice.svg',
          value: this.form.hvoice
        },
        {
          key: 'hypha',
          label: 'Hypha',
          icon: 'hypha.svg',
          value: this.form.hypha
        }
      ]
    }
  },

  methods: {
    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    calculateTokens () {
      const deferredSan = isNaN(this.deferred) ? 0 : parseFloat(this.deferred || 0)
      const ratioUsdEquity = parseFloat(this.usdAmount || 0)

      this.form.husd = (ratioUsdEquity * (1 - deferredSan * 0.01)).toFixed(2)
      this.form.hvoice = ratioUsdEquity
      this.form.hypha = (ratioUsdEquity * deferredSan * 0.01 / this.$config.contracts.hyphaUsdValue).toFixed(2)
    }
  }
}
</script>

<template lang="pug">
widget
  .q-mt-md
    .row
      .col-6.q-pa-sm
        .text-h6 USD Amount
          q-input.q-my-sm(v-model="usdAmount" outlined)
            template(v-slot:append)
              q-icon(
                name="fas fa-dollar-sign"
                color="primary"
                size="sm"
              )
      .col-6.q-pa-sm
        .text-h6 Deferred
          q-input.q-my-sm(v-model="deferred" outlined)
            template(v-slot:append)
              q-icon(
                name="fas fa-percentage"
                color="primary"
                size="sm"
              )
  // template(v-for="field in fields")
    .q-mb-lg
      .text-h6 {{ field.label }}
      q-input.q-my-sm(v-if="field.type === 'asset'" outlined :placeholder="field.label")
  .row.q-pa-md
    q-toggle(v-model="custom" label="Custom token amounts")
  .row.bg-grey-2.q-pa-md
    template(v-for="token in tokens")
      .col-4.q-pa-sm
        .text-h6 {{ token.label }}
        q-input.q-my-sm(v-model="form[token.key]" outlined :readonly="!custom")
          template(v-slot:prepend)
            q-avatar(size="md")
              img(:src="imageUrl(token.icon)")
  .next-step.q-py-md
    .row.justify-between
      .nothing
      q-btn.q-px-md(no-caps rounded color="primary" label="Next step" @click="$emit('next')")
</template>

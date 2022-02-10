<script>
export default {
  name: 'step-compensation',
  components: {
    PayoutAmounts: () => import('~/components/common/payout-amounts.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    fields: Object
  },

  data () {
    return {
      custom: false,
      salaryOption: null
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
      handler () {
        this.calculateTokens()
      }
    },

    deferred: {
      immediate: true,
      handler () {
        this.calculateTokens()
      }
    },

    '$store.state.proposals.draft.type': {
      immediate: true,
      handler () {
        this.custom = false
      }
    },

    '$store.state.proposals.draft.annualUsdSalary': {
      immediate: true,
      handler (val) {
        if (val === 0) {
          this.salaryOption = null
        }
      }
    }
  },

  computed: {
    disabledNext () {
      if (!this.usdAmount && this.$store.state.proposals.draft.category.key !== 'assignment') {
        return true
      }
      return false
    },
    usdAmount: {
      get () {
        return this.$store.state.proposals.draft.usdAmount || 0
      },

      set (value) {
        this.$store.commit('proposals/setUsdAmount', parseFloat(value))
      }
    },

    commitment: {
      get () {
        return this.$store.state.proposals.draft.commitment || 0
      },

      set (value) {
        this.$store.commit('proposals/setCommitment', value)
      }
    },

    deferred: {
      get () {
        return this.$store.state.proposals.draft.deferred || 0
      },

      set (value) {
        this.$store.commit('proposals/setDeferred', value)
      }
    },

    peg: {
      get () {
        return this.$store.state.proposals.draft.peg || 0
      },

      set (value) {
        this.$store.commit('proposals/setPeg', parseFloat(value))
      }
    },

    reward: {
      get () {
        return this.$store.state.proposals.draft.reward || 0
      },

      set (value) {
        this.$store.commit('proposals/setReward', parseFloat(value))
      }
    },

    voice: {
      get () {
        return this.$store.state.proposals.draft.voice || 0
      },

      set (value) {
        this.$store.commit('proposals/setVoice', parseFloat(value))
      }
    },

    roleCapacity: {
      get () {
        return this.$store.state.proposals.draft.roleCapacity || 0
      },

      set (value) {
        this.$store.commit('proposals/setRoleCapacity', parseInt(value))
      }
    },

    minDeferred: {
      get () {
        return this.$store.state.proposals.draft.minDeferred || 0
      },

      set (value) {
        this.$store.commit('proposals/setMinDeferred', value)
      }
    }
  },

  methods: {
    imageUrl (icon) {
      return require('~/assets/icons/' + icon)
    },

    calculateTokens () {
      this.$store.dispatch('proposals/calculateTokens')
    }
  }
}
</script>

<template lang="pug">
widget
  .q-mt-md
    .row
      .col-6.q-pa-sm(v-if="fields.usdAmount")
        .text-h6 {{ fields.usdAmount.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.usdAmount.description") {{ fields.usdAmount.description }}
        q-input.q-my-sm.rounded-border(v-model="usdAmount" outlined :disable="custom")
          template(v-slot:append)
            q-icon(
              name="fas fa-dollar-sign"
              color="primary"
              size="sm"
            )
      // .col-6.q-pa-sm(v-if="fields.deferred")
        .text-h6 {{ fields.deferred.label }}
        .text-body2.text-grey-7(v-if="fields.deferred.description") {{ fields.deferred.description }}
        q-input.q-my-sm.rounded-border(v-model="deferred" outlined :disable="custom")
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              color="primary"
              size="sm"
            )
      .col-6.q-pa-sm(v-if="fields.annualUsdSalary")
        .text-h6 {{ fields.annualUsdSalary.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.annualUsdSalary.description") {{ fields.annualUsdSalary.description }}
        q-select.q-my-sm.rounded-border(
          v-model="salaryOption"
          :options="fields.annualUsdSalary.options"
          :label="fields.annualUsdSalary.label"
          rounded
          outlined
          @input="(opt) => $store.commit('proposals/setAnnualUsdSalary', opt.value)"
        )

      .col-6.q-pa-sm(v-if="fields.roleCapacity")
        .text-h6 {{ fields.roleCapacity.label }}
        .text-body2.text-grey-7.q-my-md(v-if="fields.roleCapacity.description") {{ fields.roleCapacity.description }}
        q-input.q-my-sm.rounded-border(v-model="roleCapacity" rounded outlined)

  .row.full-width.q-pa-md(v-if="fields.commitment")
    .text-h6 {{ fields.commitment.label }}
    .row.full-width.items-center
      .text-body2.text-grey-7.q-my-md(v-if="fields.commitment.description") {{ fields.commitment.description }}
      .col-10.q-pr-md
        q-slider(
          v-model="commitment"
          :min="0"
          :max="100"
          :step="1"
          color="primary"
        )
      .col-2.q-mt-md.q-pl-sm
        q-input.rounded-border(
          v-model.number="commitment"
          rounded
          outlined
          :rules="[val => val >= 0 && val <= 100]"
        )
  .row.full-width.q-pa-md(v-if="fields.deferred")
    .text-h6 {{ fields.deferred.label }}
    .row.full-width.items-center
      .text-body2.text-grey-7.q-my-md(v-if="fields.deferred.description") {{ fields.deferred.description }}
      .col-10.q-pr-md
        q-slider(
          v-model="deferred"
          :min="0"
          :max="100"
          :step="1"
          :disable="custom"
          color="primary"
        )
      .col-2.q-mt-md.q-pl-sm
        q-input.rounded-border(
          v-model.number="deferred"
          rounded
          outlined
          :disable="custom"
          :rules="[val => val >= 0 && val <= 100]"
        )

  .row.full-width.q-pa-md(v-if="fields.minDeferred")
    .text-h6 {{ fields.minDeferred.label }}
    .row.full-width.items-center
      .text-body2.text-grey-7.q-my-md(v-if="fields.minDeferred.description") {{ fields.minDeferred.description }}
      .col-10.q-pr-md
        q-slider(
          v-model="minDeferred"
          :min="0"
          :max="100"
          :step="1"
          color="primary"
        )
      .col-2.q-mt-md.q-pl-sm
        q-input.rounded-border(
          v-model.number="minDeferred"
          rounded
          outlined
          :rules="[val => val >= 0 && val <= 100]"
        )

  .row.full-width.q-pa-md(v-if="$store.state.proposals.draft.annualUsdSalary")
    .text-h6 {{ `Salary calculation ($${$store.state.proposals.draft.annualUsdSalary} USD / year)` }}
    .row.full-width.items-center
      .text-body2.text-grey-7.q-my-md Lorem ipsum this is a test description

  .row.q-pa-md(v-if="fields.custom")
    q-toggle(v-model="custom" :label="fields.custom.label")

  .row.bg-grey-2.q-pa-md
    // TODO: Salary preview
    .col.q-pa-sm(v-if="fields.peg")
      .text-h6 {{ `${fields.peg.label} (${$store.state.dao.settings.pegToken})` }}
      q-input.q-my-sm.rounded-border(v-model="peg" outlined :readonly="!custom")
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('husd.svg')")
    .col.q-pa-sm(v-if="fields.reward")
      .text-h6 {{ `${fields.reward.label} (${$store.state.dao.settings.rewardToken})` }}
      q-input.q-my-sm.rounded-border(v-model="reward" outlined :readonly="!custom")
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('hypha.svg')")
    .col.q-pa-sm(v-if="fields.voice")
      .text-h6 {{ `${fields.voice.label} (${$store.state.dao.settings.voiceToken})` }}
      q-input.q-my-sm.rounded-border(v-model="voice" outlined :readonly="!custom")
        template(v-slot:prepend)
          q-avatar(size="md")
            img(:src="imageUrl('hvoice.svg')")

  .next-step.q-py-md
    .row.justify-between
      .nothing
      .buttons
        q-btn.q-px-md.q-mr-md(no-caps rounded flat color="primary" label="Prev step" @click="$emit('prev')")
        q-btn.q-px-md(no-caps rounded color="primary" :disable="disabledNext" label="Next step" @click="$emit('next')")
</template>

<style lang="stylus" scoped>
.rounded-border
  :first-child
    border-radius 12px
</style>

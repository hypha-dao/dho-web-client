<script>
import { mapGetters } from 'vuex'

export default {
  name: 'step-review',
  components: {
    ProposalView: () => import('~/components/proposals/proposal-view.vue')
  },

  props: {
    fields: Object
  },

  computed: {
    ...mapGetters('accounts', ['account']),

    draft () {
      return {
        creator: this.account,
        ...this.$store.state.proposals.draft,
        deferred: {
          value: this.$store.state.proposals.draft.deferred,
          min: this.$store.state.proposals.draft.minDeferred,
          max: 100
        },
        tokens: this.tokens
      }
    },

    tags () {
      return [
        { color: 'primary', label: this.draft.category.title || 'Proposal' },
        { color: 'primary', outline: true, label: 'Circle One' }
      ]
    },

    tokens () {
      const tokens = []
      if (this.fields.peg) {
        tokens.push({
          label: this.fields.peg.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.pegToken,
          value: this.$store.state.proposals.draft.peg
        })
      }

      if (this.fields.reward) {
        tokens.push({
          label: this.fields.reward.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.rewardToken,
          value: this.$store.state.proposals.draft.reward
        })
      }

      if (this.fields.voice) {
        tokens.push({
          label: this.fields.voice.label,
          icon: 'husd.svg',
          symbol: this.$store.state.dao.settings.voiceToken,
          value: this.$store.state.proposals.draft.voice
        })
      }

      return tokens
    }
  }
}
</script>

<template lang="pug">
proposal-view(
  v-bind="draft"
  :tags="tags"
  preview
)
</template>

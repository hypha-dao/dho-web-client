<script>
import { defineComponent } from 'vue'
import { TOKEN_TYPES } from '~/const'

export default defineComponent({
  name: 'payout-amounts',
  components: {
    TokenValue: () => import('./token-value.vue')
  },

  props: {
    tokens: {
      type: Array,
      default: () => []
    },
    multiplier: {
      type: Number,
      default: 1
    },
    stacked: Boolean,
    daoLogo: {
      type: String,
      default: undefined
    }
  },

  methods: {
    settingsMultiplier(label) {
      switch (label) {
        case TOKEN_TYPES.UTILITY_TOKEN:
          return this.$store.state.dao.settings.utilityTokenMultiplier
        case TOKEN_TYPES.CASH_TOKEN:
          return this.$store.state.dao.settings.treasuryTokenMultiplier
        case TOKEN_TYPES.VOICE_TOKEN:
          return this.$store.state.dao.settings.voiceTokenMultiplier
      }
    }
  }

})
</script>

<template lang="pug">
.full-width(:class="{row: $q.platform.is.desktop}")
  template(v-for="token in tokens")
    .col(v-if="token?.value" :class="{'col-12': stacked, 'q-mb-md': $q.platform.is.mobile}")
      token-value(:daoLogo="daoLogo" :multiplier="settingsMultiplier(token?.label)" v-bind="token")
</template>

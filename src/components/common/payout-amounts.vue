<script lang="ts">
import { defineComponent } from 'vue'
import { PropType } from 'vue/types/v3-component-props'
import TokenValue from './token-value.vue'

type TokenProps = Omit<InstanceType<typeof TokenValue>['$props'], 'daoLogo' | 'multiplier'>

/**
 * Displays the amounts of tokens earned for a contribution.
 */
export default defineComponent({
  name: 'payout-amounts',
  components: {
    TokenValue
  },

  props: {
    tokens: {
      type: Array as PropType<TokenProps[]>,
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
  }
})
</script>

<template lang="pug">
.full-width(:class="{ 'row':$q.platform.is.desktop }")
  template(v-for="token in tokens")
    .col.q-pa-xxs(
      :class="{ 'col-12': stacked, 'q-mb-md':$q.platform.is.mobile }"
    )
      token-value(v-bind="token", :multiplier="multiplier", :daoLogo="daoLogo")
</template>

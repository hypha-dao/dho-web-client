<script lang="ts">
import { defineComponent } from 'vue'

import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'empty-widget-label',
  props: {
    sectionTitle: String
    // proposalType: String
  },
  computed: {
    ...mapGetters('accounts', ['isMember'])
  }
})
</script>

<template lang="pug">
.text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md {{ $t('common.empty-widget-label.yourOrganizationDoesnt', { '1': sectionTitle }) }}
  span(v-if="isMember") {{ $t('common.empty-widget-label.click') }}
    span
      router-link.q-mx-xs(:to="{name: 'proposal-create'}") {{ $t('common.empty-widget-label.here') }}
    span {{ $t('common.empty-widget-label.toSetThemUp') }}
</template>

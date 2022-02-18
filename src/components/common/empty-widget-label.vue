<script>
import { mapGetters } from 'vuex'

export default {
  name: 'empty-widget-label',
  props: {
    sectionTitle: String
    // proposalType: String
  },
  computed: {
    ...mapGetters('accounts', ['isMember'])
  }
}
</script>

<template lang="pug">
    .text-body2.q-mt-sm.text-weight-thin.text-grey-7.q-my-md Your organization doesn't have any {{ sectionTitle }} yet.
      span(v-if="isMember")  Click
          span
              router-link.q-mx-xs(:to="{ name: 'proposal-create' }") here
          span  to set them up.
</template>

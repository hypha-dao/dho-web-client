<script>
import { mapActions } from 'vuex'

/**
 * A component to display login and register buttons
 */
export default {
  name: 'non-member-menu',
  props: {
    registrationEnabled: {
      type: [Boolean, Number],
      default: true
    }
  },
  methods: {
    ...mapActions('accounts', ['applyMember']),
    async onApply () {
      const res = await this.applyMember({ content: 'DAO Applicant' })
      if (res) {
        this.$EventBus.$emit('membersUpdated')
      }
    }
  }
}
</script>

<template lang="pug">
.row.items-center.q-gutter-x-sm
  div
    q-btn.text-bold.gt-sm(:label="$t('navigation.non-member-menu.becomeMember')" color="primary" text-color="white" rounded unelevated no-caps size="md" :disable="!registrationEnabled" @click="onApply")
    q-tooltip(v-if="!registrationEnabled") {{ $t('navigation.non-member-menu.registrationIsTemporarilyDisabled') }}

</template>

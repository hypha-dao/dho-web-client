<script>
import { mapActions } from 'vuex'

/**
 * A component to display login and register buttons
 */
export default {
  name: 'non-member-menu',
  props: {
    registrationEnabled: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions('accounts', ['logout', 'applyMember']),
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
    q-btn.text-bold.gt-sm(
      label="Become member"
      color="primary"
      text-color="white"
      rounded
      unelevated
      no-caps
      size="md"
      :disable="!registrationEnabled"
      @click="onApply"
    )
    q-tooltip( v-if="!registrationEnabled") Registration is temporarily disabled
  q-btn.text-bold.gt-sm(
    label="Logout"
    color="white"
    text-color="primary"
    rounded
    unelevated
    no-caps
    size="md"
    @click="logout"
  )
</template>

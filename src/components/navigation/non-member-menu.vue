<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'non-member-menu',
  props: {
    daoId: String
  },
  methods: {
    ...mapActions('accounts', ['logout', 'applyMember']),
    async onApply () {
      const res = await this.applyMember({ content: 'DAO Applicant' })
      if (res) {
        this.$EventBus.$emit('membersUpdated')
      }
    }
  },
  computed: {
    ...mapGetters('dao', ['daoSettings'])
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
      :disable="!daoSettings.registrationEnabled"
      @click="onApply"
    )
    q-tooltip( v-if="!daoSettings.registrationEnabled") Registration is temporarily disabled
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

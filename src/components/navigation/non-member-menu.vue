<script>
import { mapActions } from 'vuex'

export default {
  name: 'non-member-menu',
  props: {
    daoId: String,
    username: String
  },
  methods: {
    ...mapActions('accounts', ['logout']),
    ...mapActions('members', ['apply']),
    onApply () {
      this.apply({ content: 'DAO Applicant', applicant: this.username, daoId: this.daoId })
    }
  }
}
</script>

<template lang="pug">
.row.items-center.q-gutter-x-sm
  q-btn.text-bold.gt-sm(
    label="Become member"
    color="primary"
    text-color="white"
    rounded
    unelevated
    no-caps
    size="md"
    @click="onApply"
  )
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

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'profile-required-side',
  computed: {
    ...mapGetters('accounts', ['account'])
  }
}
</script>

<template lang="pug">
.q-pa-xs.flex.flex-center.full-height.column
  | Please fill your profile first before going any further
  q-btn.q-mt-md(
    :to="`/@${account}`"
    label="Complete my profile"
    unelevated
    color="primary"
  )
</template>

<style lang="stylus" scoped>

</style>

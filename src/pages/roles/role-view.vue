<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'role-view',
  computed: {
    ...mapGetters('roles', ['role'])
  },
  methods: {
    ...mapActions('roles', ['fetchRole'])
  },
  async mounted () {
    await this.fetchRole(this.$route.params.id)
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg Coming soon!
</template>

<style lang="stylus">

</style>

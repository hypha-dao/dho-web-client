<script>
import Banner from '~/components/layout/banner'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { Banner },
  computed: {
    ...mapGetters('layout', ['alert'])
  },

  meta: {
    title: 'Welcome',
    titleTemplate: title => `${title} - Hypha DHO`
  },

  async mounted () {
    if (this.$store.$error) {
      this.$router.push({ path: '/error' })
      return
    }
    if (!await this.autoLogin()) {
      if (!localStorage.getItem('known-user')) {
        this.$router.push({ path: '/welcome' })
      }
    }
  },

  methods: {
    ...mapActions('accounts', ['autoLogin'])
  }
}
</script>

<template lang="pug">
  div
    #q-app(:class="{ 'banner-offset': !!alert }")
      banner
      router-view
</template>

<style lang="stylus">
.banner-offset
  /deep/.q-header
    margin-top: 35px
  /deep/.menu
    margin-top: 40px
  @media (max-width: $breakpoint-sm-max)
    /deep/.q-header
      margin-top: 70px
    /deep/.menu
      margin-top: 80px
</style>

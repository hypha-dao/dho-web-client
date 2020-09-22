<script>
import Banner from '~/components/layout/banner'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: { Banner },
  computed: {
    ...mapGetters('layout', ['alert'])
  }
}
</script>

<template lang="pug">
  div
    #q-app(:class="{ 'banner-offset': !!alert }")
      banner
      router-view
</template>

<style lang="sass">
.banner-offset
  /deep/.q-header
    margin-top: 35px
  /deep/.menu
    margin-top: 40px
</style>

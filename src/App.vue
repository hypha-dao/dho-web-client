<template lang="pug">
div
  #q-app(:class="{ 'banner-offset': !!alert }")
    .banner.q-pa-xs(v-if="alert" :class="getBannerClass()") {{ alert.content }}
      q-btn.float-right(flat dense color="white" label="Dismiss" @click="dismissAlert")
    router-view
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',
  async beforeMount () {
    await this.loadAlert()
  },
  computed: {
    ...mapGetters('layout', ['alert'])
  },
  methods: {
    ...mapActions('layout', ['loadAlert']),
    ...mapMutations('layout', ['dismissAlert']),
    getBannerClass () {
      if (!this.alert) return null
      if (this.alert.level === 'success') {
        return { 'bg-green': true }
      } else if (this.alert.level === 'info') {
        return { 'bg-blue': true }
      } else if (this.alert.level === 'warning') {
        return { 'bg-yellow': true }
      } else if (this.alert.level === 'danger') {
        return { 'bg-red': true }
      }
      return { 'bg-primary': true }
    }
  }
}
</script>

<style lang="sass">
.banner-offset
  /deep/.q-header
    margin-top: 25px
.banner
  text-align: center
  color: white
  button
    margin-top: -5px
</style>

<template lang="pug">
div
  #q-app(:class="{ 'banner-offset': !!alert }")
    .banner.q-pa-sm(v-if="alert" :class="getBannerClass()")
      q-icon.q-mr-xs(v-if="alert.level === 'success'" name="fas fa-check-square")
      q-icon.q-mr-xs(v-if="alert.level === 'info'" name="fas fa-info-circle")
      q-icon.q-mr-xs(v-if="alert.level === 'warning'" name="fas fa-exclamation-triangle")
      q-icon.q-mr-xs(v-if="alert.level === 'danger'" name="fas fa-radiation")
      | {{ alert.content }}
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
        return { 'bg-orange': true }
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
    margin-top: 35px
  /deep/.menu
    margin-top: 40px
.banner
  text-align: center
  color: white
  position: fixed
  top: 0
  right: 0
  height: 40px
  z-index: 3000
  width: 100%
  button
    margin-top: -5px
</style>

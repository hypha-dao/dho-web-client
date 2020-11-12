<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'banner',
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

<template lang="pug">
.row.flex.banner.q-pa-sm.items-center(v-if="alert" :class="getBannerClass()")
  .col-10
    q-icon.q-mr-xs(v-if="alert.level === 'success'" name="fas fa-check-square")
    q-icon.q-mr-xs(v-if="alert.level === 'info'" name="fas fa-info-circle")
    q-icon.q-mr-xs(v-if="alert.level === 'warning'" name="fas fa-exclamation-triangle")
    q-icon.q-mr-xs(v-if="alert.level === 'danger'" name="fas fa-radiation")
    | {{ alert.content }}
  .col-2
    q-btn.float-right(flat dense color="white" label="Dismiss" @click="dismissAlert")
</template>

<style lang="stylus" scoped>
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
  @media (max-width: $breakpoint-sm-max)
    padding: 2px 2px;
    height: 80px
    font-size 12px
</style>

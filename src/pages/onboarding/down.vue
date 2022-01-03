<script>
import { copyToClipboard } from '~/utils/eosio'
import { Notify } from 'quasar'

export default {
  name: 'page-down',

  methods: {
    copyError () {
      const e = this.$error
      copyToClipboard(`DHO Error: ${e && e.name}\nMessage: ${e && e.message}\n`)

      Notify.create({
        color: 'green',
        message: 'Data copied, paste it to the support team',
        position: 'bottom',
        icon: 'fas fa-life-ring',
        timeout: 3000,
        actions: [
          { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },

    retry () {
      this.$error = null
      this.$router.push({ path: '/welcome' }, () => document.location.reload())
    }
  }
}
</script>

<template lang="pug">
.fullscreen.bg-primary
  .column.flex-center.fixed-center
    .world-bg(v-if="$q.platform.is.desktop" style="background: url('bg/world.svg')")
    transition(
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    )
      .text-white
        .title
          span Hypha
          strong EARTH
        .subtitle.q-mb-lg Create the next chapter in Earth's history
    .content.q-pa-lg.bg-white
      .text-subtitle1.text-bold.q-ma-lg Oops, something went wrong!
      .text-body2.q-px-xl.q-py-md We are working on bringing the DHO back. Please try again in a bit.
      .row.justify-center.q-mt-md
        q-btn.button-width.q-mx-md(color="negative" outline @click="copyError") Copy Error
        q-btn.button-width.q-mx-md(color="primary" @click="retry") Retry
</template>

<style lang="stylus" scoped>
.title
  font-size 70px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.subtitle
  font-size 22px
  @media (max-width: $breakpoint-xs-max)
    font-size 1em
    line-height 0.8
    padding-bottom 20px
.content
  text-align center
  max-width calc(100vw - 8px)
  width 450px
  border-radius 20px
  z-index 100
  .content-title
    font-weight 600
    font-size 1.2em
    line-height 2em
  .button-width
    width 120px
</style>

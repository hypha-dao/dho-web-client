<script>
export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
    documentationURL: String,

    discordURL: String
  }
}
</script>

<template lang="pug">
widget(title="Need support?")
  .flex.items-arround.full-height
    .h-b2.q-mt-md Please read our Documentation for more info. If you are stuck with a problem you can also reach out to us on discord in the "dao-support" channel.
    .row.justify-between.flex.items-center.q-mb-sm
      .col-auto
        q-btn.q-mt-md.q-px-sm.text-white(noCaps rounded color="primary" :href="documentationURL" target="_blank") Documentation
      .col
        q-btn.q-mt-md.q-ml-sm.discord-buttom(unelevated rounded color="primary" icon="fab fa-discord" size="0.7rem" :href="discordURL" target="_blank")
</template>

<style lang="stylus" scoped>
</style>

<script>
export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
  }
}
</script>

<template lang="pug">
widget(title="Need support?")
  .flex.items-arround.full-height
    .h-b2.q-mt-md Please read our Documentation for more info. If you are stuck with a problem you can also reach out to us on discord in the "dao-support" channel.
    .row.justify-between.flex.items-center.q-mb-sm
      .col-auto
        div {{this.documentationURL}}
        a(:href="'https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw'" target="_blank")
          q-btn.q-mt-md.q-px-sm.text-white(noCaps rounded color="primary") Documentation
      .col
        a(:href="'https://discord.com/channels/722537361480613950/732285564384051323'" target="_blank")
          q-btn.q-mt-md.q-ml-sm.discord-buttom(unelevated rounded color="primary" icon="fab fa-discord" size="0.7rem")
</template>

<style lang="stylus" scoped>
</style>

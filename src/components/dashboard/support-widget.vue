<script>
export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget(title="Need support?")
  .flex.items-arround.full-height
    .h-b2.q-mt-md Please read our Documentation for more info. If you are stuck with a problem you can also reach out to us on discord in the "dao-support" channel.
    .row.justify-between.flex.items-center.q-mb-sm
      .col-auto
        q-btn.q-mt-md.q-px-sm.text-white(noCaps rounded color="primary" type="a" href="https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw" target="_blank") Documentation
      .col
        q-btn.q-mt-md.q-ml-sm.discord-buttom(unelevated rounded color="internal-bg" icon="fab fa-discord" size="0.7rem" type="a" href="https://discord.com/channels/722537361480613950/732285564384051323" target="_blank")
</template>
<style lang="stylus" scoped>
.discord-buttom
  color $primary !important
</style>

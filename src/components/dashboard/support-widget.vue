<script>
export default {
  name: 'support-widget',
  components: {
    Widget: () => import('../common/widget.vue')
  }
}
</script>

<template lang="pug">
widget.full-height(title="Need support?")
  .text-caption.q-pl-sm.q-mt-lg Please read our Documentation for more info. If you are stuck with a problem you can also reach out to us on discord in the "dho-support" channel.
  .row.justify-between.q-mt-lg
    .col-auto
      q-btn.q-mt-md.q-px-sm.text-white(rounded color="primary" type="a" href="https://notepad.hypha.earth/5dC66nNXRVGpb1aTHaRJXw" target="_blank") Documentation
    .col
      q-btn.q-mt-md.q-ml-sm(round color="primary" icon="fab fa-discord" size="0.7rem" type="a" href="https://discord.com/channels/722537361480613950/732285564384051323" target="_blank")
</template>

<script>
export default {
  name: 'welcome-view'
}
</script>

<template lang="pug">
.full-width.full-height
  .absolute-center.full-width.q-pa-xl
    .text-h4 Welcome to
    .text-h3.text-bold Hypha
    .text-body2.text-weight-thin.q-mt-lg.q-mb-lg.text-grey The DHO (Decentralized Human Oranization) is a framework to build your organization from the ground uo in an organic and participative way and together with others.
    q-btn.full-width.q-mt-xl(
      label="Begin your journey"
      color="primary"
      rounded
      no-caps
      @click="$emit('onRegisterClick')"
    )
    q-btn.full-width.q-mt-sm(
      label="Login"
      color="secondary"
      rounded
      no-caps
      @click="$emit('onLoginClick')"
    )
    q-btn.full-width.q-mt-sm(
      label="Continue as guest"
      color="primary"
      rounded
      outline
      no-caps
    )
    //-   style="background: #666666;color:white;font-weight: 600;border-radius: 25px"
</template>

<style lang="stylus" scoped>

</style>

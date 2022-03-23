<script>
import { mapGetters } from 'vuex'
export default {
  name: 'welcome-view',
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  }
}
</script>

<template lang="pug">
.full-width.full-height.flex.items-center
  .full-width
    .h-h1-signup.color-primary Welcome to
    .h-h1-signup.color-primary.text-bold {{ selectedDao.name }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey {{ selectedDao.description}}
    q-btn.full-width.q-mt-xxxl(
      label="Begin your journey"
      color="primary"
      rounded
      no-caps
      unelevated
      @click="$emit('onRegisterClick')"
    )
    q-btn.full-width.q-mt-xs(
      label="Login"
      color="secondary"
      rounded
      no-caps
      unelevated
      @click="$emit('onLoginClick')"
    )
    //- to="/preview"
    q-btn.full-width.q-mt-xs(
      :to="{ name:'dashboard' }"
      label="Continue as guest"
      color="primary"
      rounded
      outline
      no-caps
      unelevated
    )
    //-   style="background: #666666;color:white;font-weight: 600;border-radius: 25px"
</template>

<style lang="stylus" scoped>

</style>

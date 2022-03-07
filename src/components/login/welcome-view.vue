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
.full-width.full-height
  .absolute-center.full-width.q-pa-xl
    .h-h1-signup.color-primary Welcome to
    .h-h1-signup.color-primary.text-bold {{ selectedDao.name }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey {{ selectedDao.description}}
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
    //- to="/preview"
    q-btn.full-width.q-mt-sm(
      :to="{ name:'dashboard' }"
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

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'welcome-view',
  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings'])
  }
}
</script>

<template lang="pug">
.full-width.full-height.flex.items-center
  .full-width
    .h-h1-signup.color-primary Welcome to
    .h-h1-signup.color-primary.text-bold {{ selectedDao.title.replace(/^\w/, (c) => c.toUpperCase()) }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey If this is your first time, you can either visit the DAO as a guest or register for a new account. If you already have an account, please login with your Telos account credentials. As a member, you have full access to all features of the DAO. If you are not a member yet, click on “Register new account” after you have logged in.
    div
      q-btn.full-width.q-mt-xxxl(
        label="Register new account"
        color="primary"
        rounded
        no-caps
        unelevated
        :disable="!daoSettings.registrationEnabled"
        @click="$emit('onRegisterClick')"
      )
      q-tooltip(v-if="!daoSettings.registrationEnabled" anchor="top middle") Registration is temporarily disabled
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

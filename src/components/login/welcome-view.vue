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
.full-width.full-height.flex(:class="{ 'items-start':$q.platform.is.mobile, 'items-center':$q.platform.is.desktop }")
  .full-width
    .h-h1-signup.color-primary(v-if="$q.platform.is.desktop") Welcome to
    .h-h1-signup-mobile(v-if="$q.platform.is.mobile") Welcome to
    .h-h1-signup.color-primary.text-bold(v-if="$q.platform.is.desktop") {{ selectedDao.title.replace(/^\w/, (c) => c.toUpperCase()) }}
    .h-h1-signup-mobile.text-bold(v-if="$q.platform.is.mobile") {{ selectedDao.title.replace(/^\w/, (c) => c.toUpperCase()) }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey(v-if="$q.platform.is.desktop") If this is your first time, you can either visit the DAO as a guest or register for a new account. If you already have an account, please login with your Telos account credentials. As a member, you have full access to all features of the DAO. If you are not a member yet, click on “Register new account” after you have logged in.
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey.custom-calc-margin(v-if="$q.platform.is.mobile") The DHO (Decentralized Human Organization) is a framework to build your organization from the ground up in an organic and participative way and together with others.
    div
      q-btn.full-width.q-mt-xxxl(
        label="Begin your journey"
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

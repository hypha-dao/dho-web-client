<script>
export default {
  name: 'buttom-section',
  props: {
    /**
     * Selected step from Login screen
     */
    step: String,
    /**
     * All possibles steps from Login screens
     */
    steps: Object,
    /**
     * To show the login with wallet msg
     */
    stepPK: Boolean,
    daoSettings: Object
  }
}
</script>

<template lang="pug">
.full-width.row(:class="{ 'justify-center':$q.platform.is.mobile, 'q-pt-md':$q.platform.is.desktop }")
  template(v-if="$q.platform.is.desktop")
    .col-6
      .h-b3-signup.color-secondary(v-if="step === steps.login") New User?
          span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="daoSettings.registrationEnabled ? $emit('onClickRegisterHere'): undefined") Register here
            q-tooltip(v-if="!daoSettings.registrationEnabled" anchor="bottom middle") Registration is temporarily disabled
      .h-b3-signup.color-secondary(v-else-if="step === steps.register") Are you a member?
          span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") Login here
    .col-6
      .h-b3-signup.color-secondary(v-if="stepPK") Otherwise
        span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLogin')") Login with wallet
  template(v-if="$q.platform.is.mobile")
    .h-b3-signup.color-secondary(v-if="step === steps.login") New User?
      span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="daoSettings.registrationEnabled ? $emit('onClickRegisterHere'): undefined") Register here
        q-tooltip(v-if="!daoSettings.registrationEnabled" anchor="bottom middle") Registration is temporarily disabled
</template>

<style lang="stylus" scoped>
</style>

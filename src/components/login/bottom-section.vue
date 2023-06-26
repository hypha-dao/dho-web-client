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
      .h-b3-signup.color-secondary(v-if="step === steps.login") {{ $t('login.bottom-section.newUser') }}
        span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="daoSettings.registrationEnabled ? $emit('onClickRegisterHere'): undefined") {{ $t('login.bottom-section.registerHere') }}
          q-tooltip(v-if="!daoSettings.registrationEnabled" anchor="bottom middle") {{ $t('login.bottom-section.registrationIsTemporarilyDisabled') }}
      .h-b3-signup.color-secondary(v-else-if="step === steps.register") {{ $t('login.bottom-section.areYouAMember') }}
        span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") {{ $t('login.bottom-section.loginHere') }}
    .col-6
      .h-b3-signup.color-secondary(v-if="stepPK") {{ $t('login.bottom-section.otherwise') }}
        span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLogin')") {{ $t('login.bottom-section.loginWithWallet') }}
  template(v-if="$q.platform.is.mobile")
    .h-b3-signup.color-secondary(v-if="step === steps.login") {{ $t('login.bottom-section.newUser1') }}
      span.h-b3-signup.text-primary.q-ml-xs.cursor-pointer(style="text-decoration: underline" @click="daoSettings.registrationEnabled ? $emit('onClickRegisterHere'): undefined") {{ $t('login.bottom-section.registerHere1') }}
        q-tooltip(v-if="!daoSettings.registrationEnabled" anchor="bottom middle") {{ $t('login.bottom-section.registrationIsTemporarilyDisabled1') }}

</template>

<style lang="stylus" scoped>
</style>

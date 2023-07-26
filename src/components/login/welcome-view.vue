<script>
import { mapGetters } from 'vuex'

export default {
  name: 'welcome-view',

  props: {
    isOnboarding: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('dao', ['daoSettings', 'selectedDao'])
  }
}
</script>
<template lang="pug">
.full-width.full-height.flex(:class="{ 'items-start':!$q.screen.gt.md, 'items-center':$q.screen.gt.md }")
  .full-width.full-height.flex.column.justify-between.no-wrap(:style="{ 'padding-bottom': '50px' }")
    .full-height.flex.justify-center.column
      .row
        .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ isOnboarding ? 'Launch your' : 'Welcome to' }}
        .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }" :class="{ 'q-ml-xs': !$q.screen.lt.sm }") {{ isOnboarding ? 'first DAO' : selectedDao?.title?.replace(/^\w/, (c) => c.toUpperCase()) }}
      .h-h4.color-secondary.q-my-xxxl(v-if="$q.screen.gt.md && isOnboarding") {{ $t('login.welcome-view.youNeedAn') }}
      .h-b1-signup.text-h-gray.q-py-xl.leading-loose(v-if="$q.screen.gt.md && !isOnboarding") {{ $t('login.welcome-view.isonboarding') }}
      .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey.custom-calc-margin(v-if="!$q.screen.gt.md") {{ $t('login.welcome-view.theDhoDecentralized') }}
    div
      q-btn.full-width.q-mt-xl.text-bold(:disable="false" @click="$emit('onRegisterClick')" color="primary" :label="$t('login.welcome-view.createNewHyphaAccount')" no-caps rounded unelevated)
        q-tooltip(v-if="false" anchor="top middle") {{ $t('login.welcome-view.registrationIsTemporarilyDisabled') }}
      q-btn.full-width.q-mt-sm.text-bold(@click="$emit('onLoginClick')" color="secondary" :label="$t('login.welcome-view.login')" no-caps rounded unelevated)
      q-btn.full-width.q-mt-sm.text-bold(:to="{ name:'dashboard' }" color="primary" :label="$t('login.welcome-view.continueAsAGuest')" no-caps outline rounded unelevated v-if="!isOnboarding")
      .q-py-xl
      //- TODO: temporarily commented (what should happen after clicking)
      //- .h-b1-signup.text-h-gray.q-py-xl.row.items-center {{ $t('login.welcome-view.useAnExisting') }}
      //-   q-btn.q-pa-none.text-underline.q-ml-xxs(flat color="primary" no-caps padding="none" @click="onPreviousStep") {{ $t('login.welcome-view.blockhainAccount') }}

</template>

<style lang="stylus" scoped>
</style>

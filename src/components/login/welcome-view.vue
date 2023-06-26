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
.full-width.full-height.flex(:class="{ 'items-start':$q.platform.is.mobile, 'items-center':$q.platform.is.desktop }")
  .full-width
    .h-h1-signup.text-heading {{ isOnboarding ? 'Launch your' : 'Welcome to' }}
      .text-weight-800 {{ isOnboarding ? 'first DAO' : selectedDao?.title?.replace(/^\w/, (c) => c.toUpperCase()) }}
    .h-h4.color-secondary.q-my-xxxl(v-if="$q.platform?.is.desktop && isOnboarding") {{ $t('login.welcome-view.youNeedAn') }}
    .h-b1-signup.text-h-gray.q-py-xl.leading-loose(v-if="$q.platform?.is.desktop && isOnboarding") {{ $t('login.welcome-view.isonboarding') }}
      b {{ $t('login.welcome-view.ifThisIs') }}
      | {{ $t('login.welcome-view.clickCreateNew') }}
      b {{ $t('login.welcome-view.ifYouAlready') }}
      | {{ $t('login.welcome-view.clickThe') }}
    .h-b1-signup.color-secondary.text-weight-thin.q-mt-lg.q-mb-lg.text-grey.custom-calc-margin(v-if="$q.platform.is.mobile") {{ $t('login.welcome-view.theDhoDecentralized') }}
    q-btn.full-width.q-mt-xl.text-bold(:disable="false" @click="$emit('onRegisterClick')" color="primary" :label="$t('login.welcome-view.createNewHyphaAccount')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
      q-tooltip(v-if="false" anchor="top middle") {{ $t('login.welcome-view.registrationIsTemporarilyDisabled') }}
    q-btn.full-width.q-mt-sm.text-bold(@click="$emit('onLoginClick')" color="secondary" :label="$t('login.welcome-view.login')" no-caps="no-caps" rounded="rounded" unelevated="unelevated")
    q-btn.full-width.q-mt-sm.text-bold(:to="{ name:'dashboard' }" color="primary" :label="$t('login.welcome-view.continueAsAGuest')" no-caps="no-caps" outline="outline" rounded="rounded" unelevated="unelevated" v-if="!isOnboarding")
    .h-b1-signup.text-h-gray.q-py-xl.row.items-center {{ $t('login.welcome-view.useAnExisting') }}
      q-btn.q-pa-none.text-underline.q-ml-xxs(flat="flat" color="primary" no-caps="no-caps" padding="none" @click="onPreviousStep") {{ $t('login.welcome-view.blockhainAccount') }}

</template>

<style lang="stylus" scoped>
</style>

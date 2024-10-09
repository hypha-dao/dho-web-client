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
  },

  methods: {
    goNext() {
      if (this.$router.currentRoute.name === 'create-your-dao' && localStorage.getItem('autoLogin')) {
        this.$emit('onRegisterClick')
      } else {
        this.$emit('onLoginClick')
      }
    }
  }
}
</script>
<template lang="pug">
.full-width.full-height.flex(:class="{ 'items-start q-pa-xl':!$q.screen.gt.md, 'items-center':$q.screen.gt.md }")
  .full-width.full-height.flex.column.justify-between.no-wrap(:style="{ 'padding-bottom': '50px' }")
    .full-height.flex.column(:class="{ 'justify-start': !$q.screen.gt.md, 'justify-center': $q.screen.gt.md }")
      .row(v-if="$router.currentRoute.name === 'create-your-dao'" :class="{ 'q-mb-xxxl': $q.screen.gt.md }")
        .font-lato.text-heading.text-bold(:class="{ 'desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ $t('login.welcome-view.launchYourFirst') }}
        .text-heading.q-mt-md.text-bold(:style="'font-size: 18px'") {{ $t('login.welcome-view.youNeedAHyphaAccountPangea') }}
      .row(v-else :style="'line-height: 52px; width: 70%;'" :class="{ 'q-mb-xxxl': $q.screen.gt.md }")
        .font-lato.text-heading.text-bold(:class="{ 'desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ isOnboarding ? 'Launch your' : 'Welcome to' }}
        .font-lato.text-heading.text-bold(:class="{ 'desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ isOnboarding ? 'first DAO' : selectedDao?.title?.replace(/^\w/, (c) => c.toUpperCase()) }}
      .h-h4.color-secondary.q-my-xxxl(v-if="$q.screen.gt.md && isOnboarding") {{ $t('login.welcome-view.youNeedAn') }}
      .h-b1-signup.text-h-gray.q-py-xxs.leading-loose(v-if="$q.screen.gt.md && !isOnboarding")
        template(v-if="$router.currentRoute.name === 'create-your-dao'") {{ $t('login.welcome-view.ifYouAlreadyHaveAHyphaAccountPangea') }}
        template(v-else) {{ $t('login.welcome-view.isonboardingPangea') }}
      .h-b1-signup.color-secondary.q-mt-lg.q-mb-lg.text-grey.custom-calc-margin(v-if="!$q.screen.gt.md") {{ $t('login.welcome-view.theDhoDecentralized') }}
    div
    q-btn.full-width.q-mt-xl.text-bold(:disable="false" @click="$emit('onRegisterClick')" color="primary" no-caps rounded unelevated)
      .full-width.flex.justify-between
          q-avatar(size="20px")
            img(src="/chains/pangea.png")
          div {{$t('login.welcome-view.createPangeaAccount')}}
          div
      q-tooltip(v-if="false" anchor="top middle") {{ $t('login.welcome-view.registrationIsTemporarilyDisabled') }}
    q-btn.full-width.q-mt-sm.text-bold(@click="goNext()" color="secondary" no-caps rounded unelevated)
      .full-width.flex.justify-between
        q-avatar(size="20px")
          img(src="/chains/pangea.png")
        div {{$t('login.welcome-view.login')}}
        div
      </q-avatar>
    q-btn.full-width.q-mt-sm.text-bold(:to="{ name:'dashboard' }" color="primary" :label="$t('login.welcome-view.continueAsAGuest')" no-caps outline rounded unelevated v-if="!isOnboarding && $router.currentRoute.name !== 'create-your-dao'")
      //- TODO: temporarily commented (what should happen after clicking)
      //- .h-b1-signup.text-h-gray.q-py-xl.row.items-center {{ $t('login.welcome-view.useAnExisting') }}
      //-   q-btn.q-pa-none.text-underline.q-ml-xxs(flat color="primary" no-caps padding="none" @click="onPreviousStep") {{ $t('login.welcome-view.blockhainAccount') }}

</template>

<style lang="stylus" scoped>
.desktop-font-size
  font-size: 44px !important
</style>

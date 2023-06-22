<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
export default {
  name: 'login-view',
  mixins: [validation],
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  props: {
    dhoName: String,
    isOnboarding: {
      type: Boolean,
      default: false
    },
    pk: Boolean
  },

  data () {
    return {
      pkForm: false,
      form: {
        account: null,
        privateKey: null
      },
      errorPrivateKey: null,
      submitting: false
    }
  },

  computed: {
    ...mapGetters('accounts', ['loading'])
  },

  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp']),
    async onLoginWallet (idx) {
      await this.loginWallet({ idx, returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home' })
    },
    async onLoginInApp () {
      this.errorPrivateKey = null
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      this.errorPrivateKey = await this.loginInApp({
        ...this.form,
        returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home'
      })
      this.submitting = false
    },
    openUrl (url) {
      window.open(url)
    }
    // onLoginWithPK () {
    //   this.pkForm = true
    //   this.$emit('onLoginWithPK')
    // }
  }
}
</script>

<template lang="pug">
.full-width.full-height.flex(:class="{ 'items-start':$q.platform.is.mobile, 'items-center':$q.platform.is.desktop }")
  .full-width
    template(v-if="$q.platform.is.desktop")
      .h-h1-signup {{ $t('login.login-view.loginTo') }}
        span.h-h1-signup.text-bold {{ $t('login.login-view.your') }}
      .h-h1-signup.text-bold {{ $t('login.login-view.account') }}
    template(v-if="$q.platform.is.mobile")
      span
        .h-h1-signup-mobile {{ $t('login.login-view.loginTo1') }}
          .text-bold {{ $t('login.login-view.yourAccount') }}
    .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg(v-if="$q.platform.is.desktop") {{ $t('login.login-view.youCanEither') }}
      a(target="_tab" href="https://seedslibrary.com/light-wallet/") {{ $t('login.login-view.downloadHere') }}
      | {{ $t('login.login-view.orAnchor') }}
      a(target="_tab" href="https://greymass.com/anchor/") {{ $t('login.login-view.desktopAppFor') }}
      | {{ $t('login.login-view.andAMobile') }}
      a(target="_tab" href="https://play.google.com/store/apps/details?id=com.greymass.anchor&hl=de&gl=US") {{ $t('login.login-view.android') }}
      | {{ $t('login.login-view.and') }}
      a(target="_tab" href="https://apps.apple.com/us/app/anchor-wallet/id1487410877") {{ $t('login.login-view.nbspios') }}
      | {{ $t('login.login-view.forMore') }}
      a(target="_tab" href="https://docs.google.com/presentation/d/1RWbnMEIJpYSOoae7FJNAVprI2aR2yGTQlBaYtIR9vIs/present?slide=id.g84be9ac256_0_0") {{ $t('login.login-view.seeTheseSlidesnbsp') }}
    .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg(v-if="$q.platform.is.mobile") {{ $t('login.login-view.pleaseLoginWith') }}
    .col-12(v-if="pkForm && pk")
      .text-h5.text-bold.input-label.q-mb-md {{ $t('login.login-view.account1') }}
      q-input(ref="account" v-model="form.account" :placeholder="$t('login.login-view.account2')" maxlength="12" :rules="[rules.required, rules.accountFormat]" lazy-rules="lazy-rules" rounded="rounded" dense="dense" outlined="outlined" bg-color="white")
      .text-h5.text-bold.input-label.q-mb-md {{ $t('login.login-view.privateKey') }}
      q-input(ref="privateKey" v-model="form.privateKey" type="password" :placeholder="$t('login.login-view.privateKey1')" :rules="[rules.required]" lazy-rules="lazy-rules" :error="!!errorPrivateKey" :error-message="errorPrivateKey" rounded="rounded" dense="dense" outlined="outlined" bg-color="white")
      .row.justify-end
        q-btn.q-mt-md.login-button(unelevated="unelevated" :label="$t('login.login-view.login')" no-caps="no-caps" @click="onLoginInApp" :loading="submitting")
    .col-xs-12.col-md-6.q-mt-xxxl(v-else)
      q-list
        q-item.wallet.q-my-xs(v-if="$ual" v-for="(wallet, idx) in $ual.authenticators" :key="wallet.getStyle().text" v-ripple="v-ripple" :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }")
          q-item-section.cursor-pointer(avatar="avatar" @click="onLoginWallet(idx)")
            img(:src="wallet.getStyle().icon" width="20")
          q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ $t('login.login-view.login1', { '1': wallet.getStyle().text, '2': wallet.getStyle().text === 'Seeds' ? '(beta)' : '' }) }}
          q-item-section(avatar="avatar")
            .flex
              loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
              q-btn(v-else :color="wallet.getStyle().textColor" icon="fas fa-cloud-download-alt" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense="dense" flat="flat" size="10px")
                q-tooltip {{ $t('login.login-view.getApp') }}

</template>

<style lang="stylus" scoped>
.wallet
  min-height 40px !important
  border-radius 15px
  font-weight 600
.login-button
  background: #242F5D
  color:white
  font-weight: 600
  border-radius: 25px
  width: 152px
  height: 40px
</style>

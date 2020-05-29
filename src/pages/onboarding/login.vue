<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'page-login',
  mixins: [validation],
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
    ...mapActions('accounts', ['loginWallet', 'loginInApp', 'autoLogin']),
    async onLoginWallet (idx) {
      await this.loginWallet({ idx, returnUrl: this.$route.query.returnUrl })
    },
    async onLoginInApp () {
      this.errorPrivateKey = null
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      this.errorPrivateKey = await this.loginInApp({
        ...this.form,
        returnUrl: this.$route.query.returnUrl
      })
      this.submitting = false
    },
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>

<template lang="pug">
q-page.flex.flex-center.column
  .world-bg(v-if="$q.platform.is.desktop" style="background: url('statics/bg/world.svg')")
  transition(
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  )
    div
      .title
        span Hypha
        strong EARTH
      .subtitle.q-mb-lg Create the next chapter in Earth's history
  .content.q-pa-md.row.q-col-gutter-md
    .col-12(v-if="pkForm")
      q-input(
        ref="account"
        v-model="form.account"
        label="Account"
        maxlength="12"
        :rules="[rules.required, rules.accountFormat]"
        lazy-rules
      )
      q-input(
        ref="privateKey"
        v-model="form.privateKey"
        label="Private key"
        :rules="[rules.required]"
        lazy-rules
        :error="!!errorPrivateKey"
        :error-message="errorPrivateKey"
      )
      q-btn.full-width.q-mt-md(
        unelevated
        label="Login"
        @click="onLoginInApp"
        :loading="submitting"
        style="background: #666666;color:white;font-weight: 600;border-radius: 25px"
      )
      .login-text3
        span.wallet-login(@click="pkForm = !pkForm") Login with a wallet
        | .&nbsp;New User?&nbsp;
        router-link(to="/register") Register here.
    .col-xs-12.col-md-6(v-if="!pkForm")
      .content-title Welcome!
      .content-text1 Please login with one of the wallets, your private key or continue as guest.
      .content-text2 For improved security, we recommend to download and install the Anchor wallet.
      .content-text3
        | New User?&nbsp;
        router-link(to="/register") Register here.
    .col-xs-12.col-md-6(v-if="!pkForm")
      q-list
        q-item.wallet(
          v-for="(wallet, idx) in $ual.authenticators"
          :key="wallet.getStyle().text"
          v-ripple
          :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
        )
          q-item-section.cursor-pointer(
            avatar
            @click="onLoginWallet(idx)"
          )
            img(
              :src="wallet.getStyle().icon"
              width="30"
            )
          q-item-section.cursor-pointer(@click="onLoginWallet(idx)") {{ wallet.getStyle().text }}
          q-item-section(avatar)
            .flex
              q-spinner(
                v-if="loading === wallet.getStyle().text"
                :color="wallet.getStyle().textColor"
                size="2em"
              )
              q-btn(
                v-else
                :color="wallet.getStyle().textColor"
                icon="fas fa-download"
                @click="openUrl(wallet.getOnboardingLink())"
                target="_blank"
                dense
                flat
                size="12px"
              )
                q-tooltip Get app
        q-item.wallet.text-white(
          style="background:#666666"
        )
          q-item-section.cursor-pointer(
            @click="pkForm = !pkForm"
          ) LOGIN WITH KEY
        q-item.wallet.text-white(
          style="background:#0db68c"
          to="/dashboard"
        )
          q-item-section.cursor-pointer continue as GUEST
</template>

<style lang="stylus" scoped>
.wallet
  border-radius 25px
  margin-bottom 10px
  text-transform uppercase
  font-weight 600
.title
  font-size 70px
  @media (max-width: $breakpoint-xs-max)
    letter-spacing -3px
    font-size 3.5em
    line-height 1.2
.subtitle
  font-size 22px
  @media (max-width: $breakpoint-xs-max)
    font-size 1em
    line-height 0.8
    padding-bottom 20px
.content
  text-align center
  width 450px
  border-radius 20px
  background rgba(255, 255, 255, 0.3)
  z-index 100
  @media (max-width: $breakpoint-xs-max)
    max-width 90%
  .content-title
    font-weight 600
    font-size 26px
  .content-text1
    font-size 1em
    line-height 1.2em
    margin-top 10px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .content-text2
    font-size 1em
    line-height 1.2em
    margin-top 30px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .content-text3
    font-size 12px
    margin-top 20px
    @media (max-width: $breakpoint-xs-max)
      max-width 90%
  .wallet-login
    cursor pointer
    text-decoration underline
  a
    color black
</style>

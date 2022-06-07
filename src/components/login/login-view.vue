<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
export default {
  name: 'login-view',
  mixins: [validation],
  computed: {
    ...mapGetters('accounts', ['loading'])
  },
  props: {
    dhoName: String,
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
  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp']),
    async onLoginWallet (idx) {
      await this.loginWallet({ idx, returnUrl: this.$route.query.returnUrl || 'home' })
    },
    async onLoginInApp () {
      this.errorPrivateKey = null
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      this.errorPrivateKey = await this.loginInApp({
        ...this.form,
        returnUrl: this.$route.query.returnUrl || 'home'
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
.full-width.full-height.flex.items-center
  .full-width
    .h-h1-signup Login to
      span.h-h1-signup.text-bold  your
    .h-h1-signup.text-bold account
    .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg Welcome! Please login with one of the wallets, your private key or continue as guest. For improved security, we recommend to download and install the Anchor wallet.
    .col-12(v-if="pkForm && pk")
        .text-h5.text-bold.input-label.q-mb-md Account
        q-input(
          ref="account"
          v-model="form.account"
          placeholder="Account"
          maxlength="12"
          :rules="[rules.required, rules.accountFormat]"
          lazy-rules
          rounded
          dense
          outlined
          color="accent"
          bg-color="white"
        )
        .text-h5.text-bold.input-label.q-mb-md Private key
        q-input(
          ref="privateKey"
          v-model="form.privateKey"
          type="password"
          placeholder="Private key"
          :rules="[rules.required]"
          lazy-rules
          :error="!!errorPrivateKey"
          :error-message="errorPrivateKey"
          rounded
          dense
          outlined
          color="accent"
          bg-color="white"
        )
        .row.justify-end
          q-btn.q-mt-md.login-button(
            unelevated
            label="Login"
            no-caps
            @click="onLoginInApp"
            :loading="submitting"
          )
    .col-xs-12.col-md-6.q-mt-xxxl(v-else)
      q-list
        q-item.wallet.q-my-xs(
          v-if="$ual"
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
              width="20"
            )
          q-item-section.cursor-pointer.text-center.text-capitalize(@click="onLoginWallet(idx)") {{ wallet.getStyle().text + (wallet.getStyle().text === 'Seeds' ? ' (Beta)' : '') }}
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
                icon="fas fa-cloud-download-alt"
                @click="openUrl(wallet.getOnboardingLink())"
                target="_blank"
                dense
                flat
                size="10px"
              )
                q-tooltip Get app
        //- q-item.wallet.text-white(
        //-   style="background:#242F5D"
        //-   v-ripple
        //-   dense
        //- )
        //-   q-item-section.cursor-pointer(
        //-         avatar
        //-       )
        //-       q-btn(
        //-         icon="fas fa-key"
        //-         flat
        //-         dense
        //-         size="sm"
        //-       )
        //-   q-item-section.cursor-pointer.text-center.text-capitalize(
        //-     @click="onLoginWithPK()"
        //-   ) Private Key
        //-   q-item-section(avatar)
</template>

<style lang="stylus" scoped>
.wallet
  min-height 40px !important
  border-radius 15px
  text-transform uppercase
  font-weight 600
.login-button
  background: #242F5D
  color:white
  font-weight: 600
  border-radius: 25px
  width: 152px
  height: 40px
</style>

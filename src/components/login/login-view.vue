<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
export default {
  name: 'login-view',
  mixins: [validation],
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    InputField: () => import('~/components/common/input-field.vue')
  },
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
    .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg
      | You can either login with your SEEDS Light Wallet (
      a(target="_tab" href='https://seedslibrary.com/light-wallet/') Download here
      | ) Or Anchor, a secure and Open Source tool that is available for download as a&nbsp;
      a(target="_tab" href='https://greymass.com/anchor/') Desktop App for Windows and Mac&nbsp;
      | and a mobile app for both&nbsp;
      a(target="_tab" href='https://play.google.com/store/apps/details?id=com.greymass.anchor&hl=de&gl=US') Android
      |  and
      a(target="_tab" href='https://apps.apple.com/us/app/anchor-wallet/id1487410877') &nbsp;iOS
      | . For more help with setting up Anchor,
      a(target="_tab" href='https://docs.google.com/presentation/d/1RWbnMEIJpYSOoae7FJNAVprI2aR2yGTQlBaYtIR9vIs/present?slide=id.g84be9ac256_0_0')
        | see these slides.&nbsp;

    .col-12(v-if="pkForm && pk")
        .text-h5.text-bold.input-label.q-mb-md Account
        q-input(
          ref="account"
          color = "heading"
          v-model="form.account"
          placeholder="Account"
          maxlength="12"
          :rules="[rules.required, rules.accountFormat]"
          lazy-rules
          rounded
          dense
          outlined
          bg-color="white"
        )
        .text-h5.text-bold.input-label.q-mb-md Private key
        q-input(
          ref="privateKey"
          color = "heading"
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
          q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ wallet.getStyle().text }} Login {{ wallet.getStyle().text === 'Seeds' ? '(beta)' :''}}
          q-item-section(avatar)
            .flex
              loading-spinner(
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
  font-weight 600
.login-button
  background: #242F5D
  color:white
  font-weight: 600
  border-radius: 25px
  width: 152px
  height: 40px
</style>

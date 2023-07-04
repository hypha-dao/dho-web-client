<script>
import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'register-user-with-captcha-view',
  mixins: [validation],
  components: {
    Captcha: () => import('~/components/form/captcha.vue'),
    QrcodeVue
  },
  props: {
  },

  data() {
    const steps = {
      captcha: {
        name: 'captcha',
        index: 1,
        nextStep: 'inviteLink',
        action: () => { return this.$emit('stepChanged', this.steps.inviteLink.name) }
      },
      inviteLink: {
        name: 'inviteLink',
        index: 2,
        nextStep: 'finish',
        action: () => { return this.$emit('stepChanged', this.steps.finish.name) }
      },
      finish: {
        name: 'finish',
        index: 3,
        nextStep: 'captcha',
        action: () => { return this.$emit('stepChanged', this.steps.captcha.name) }
      }
    }
    return {
      inviteLink: null,
      step: steps.captcha.name,
      stepIndex: {
        captcha: 1,
        inviteLink: 2,
        finish: 3
      },
      steps,
      error: null,
      generating: false,
      submitting: false,
      hyphaAuthenticators: this.$ual?.authenticators?.filter((authenticator) => {
        return authenticator.ualName === 'hypha'
      }) || []
    }
  },
  async mounted() {
    this.$emit('stepChanged', 'captcha')
  },
  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp']),
    async next() {
      const currentStep = this.steps[this.step]

      this.step = currentStep.nextStep

      await currentStep.action()
    },
    async onLoginWallet(idx) {
      await this.loginWallet({ idx, returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home' })
    },
    async setCaptchaResponse(data) {
      this.inviteLink = data.inviteLink
    },
    copyText() {
      const storage = document.createElement('textarea')
      storage.value = this.inviteLink
      this.$refs.root.appendChild(storage)
      storage.select()
      storage.setSelectionRange(0, 99999)
      document.execCommand('copy')
      this.$refs.root.removeChild(storage)
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container
  #top-indicator(ref="root")
    .indicator.row.q-gutter-sm.justify-center(v-if="$q.screen.lt.md || $q.screen.md")
      .ellipse-border(:class="step === 'captcha' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'inviteLink' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
  q-scroll-area#form-container.full-width.full-height(:thumb-style=" { 'opacity': '0' }" ref="scrollArea")
    .q-mb-xxs
    #internal-container
      #form1(v-show="step === this.steps.captcha.name")
        template
          .h-h1-signup {{ $t('login.register-user-with-captcha-view.createNew') }}
            .text-bold {{ $t('login.register-user-with-captcha-view.hyphaAccount') }}
        .h-h2-signup {{ $t('login.register-user-with-captcha-view.pleaseVerifyYou') }}
        captcha(vue-recaptcha="vue-recaptcha" sitekey="6LfPcOUkAAAAAEXUdeFqdsJUob93TpWFEoHdj_yF" @setCaptchaResponse="this.setCaptchaResponse" ev-bind:callback="callback")
      #form2(v-show="step === this.steps.inviteLink.name")
        template
          .row
            .col-7
              .h-h1-signup {{ $t('login.register-user-with-captcha-view.proceedWith') }}
                .text-bold {{ $t('login.register-user-with-captcha-view.hyphaWallet') }}
            .col-5.qr-code-wrapper
              qrcode-vue(:value="inviteLink" size="150")
          .row
            .col-4.signup-mobile-app-preview
              img.full-width(src="bg/hypha-wallet-preview.png" alt="Hypha Wallet Preview")
            .col-8.font-lato
              .h-h2-signup {{ $t('login.register-user-with-captcha-view.setupHyphaWallet') }}
              .p-onboarding.bold {{ $t('login.register-user-with-captcha-view.scanTheQr') }}
              .p-onboarding {{ $t('login.register-user-with-captcha-view.itContainsThe') }}
              .p-onboarding.bold {{ $t('login.register-user-with-captcha-view.onceTheAccount') }}
              .p-onboarding {{ $t('login.register-user-with-captcha-view.youAreSet') }}
              .row.q-mt-md.items-center
                .onboarding-invite-link.text-primary.text-bold.h-b2( @click="copyText()" ) {{ $t('login.register-user-with-captcha-view.copyInviteLink') }}
                q-icon.q-ml-xxs(name="far fa-file")
      #form3(v-show="step === this.steps.finish.name")
        template
          .h-h1-signup {{ $t('login.register-user-with-captcha-view.loginWith') }}
            .text-bold {{ $t('login.register-user-with-captcha-view.hyphaWallet1') }}
          .h-h2-signup {{ $t('login.register-user-with-captcha-view.signYourFirstTransaction') }}
          p.text-normal {{ $t('login.register-user-with-captcha-view.didYouCreate') }}
          q-list
            q-item.wallet.q-my-xs(v-for="(wallet, idx) in this.hyphaAuthenticators" :key="wallet.getStyle().text" v-ripple :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }")
              q-item-section.cursor-pointer(avatar @click="onLoginWallet(idx)")
                img(:src="wallet.getStyle().icon" width="20")
              q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ $t('login.register-user-with-captcha-view.login', { '1': wallet.getStyle().text, '2': wallet.getStyle().text === 'Seeds' ? '(beta)' : '' }) }}
              q-item-section(avatar)
                .flex
                  loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
                  q-btn(v-else :color="wallet.getStyle().textColor" icon="fas fa-cloud-download-alt" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense flat size="10px")
                    q-tooltip {{ $t('login.register-user-with-captcha-view.getApp') }}
    #bottom-indicator.row.items-center
      .col
        .row.q-gutter-sm(v-if="$q.screen.gt.md")
          .ellipse-border(:class="'ellipse-filled'")
          .ellipse-border(:class="(step === this.steps.inviteLink.name || step === this.steps.finish.name ) && 'ellipse-filled'")
          .ellipse-border(:class="step === this.steps.finish.name && 'ellipse-filled'")
      .col-4(v-if="$q.platform.is.desktop")
        q-btn.full-width(:label="step === 'finish' ? 'Need Help?' : 'Next'" color="primary" unelevated @click="next" :disable="!this.inviteLink" :loading="submitting" rounded no-caps)
        .h-b3-signup.color-secondary.flex.column(v-if="$q.platform.is.mobile") {{ $t('login.register-user-with-captcha-view.areYouAMember') }}
          span.h-b3-signup.text-primary.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") {{ $t('login.register-user-with-captcha-view.loginHere') }}

</template>

<style lang="stylus" scoped>
#form1
#form2
#form3
  height 100%
#form-container
  max-height 80vh
#internal-container
  display flex
  flex-direction column
  justify-content space-between !important
  height auto
  width 100%
  margin-bottom 50px
#top-indicator
  width: 100%
  .indicator
    margin-bottom: 10px
#bottom-indicator
  margin-top 22px
  width 100%
.main-container
  margin-top 0
.ellipse-border
 width: 10px
 height: 10px
 border: 1px solid $primary
 border-radius: 10px
.ellipse-filled
 background-color: $primary
.input-label-mobile
  font-size: 22px
  font-weight: 600

.q-item
  border-radius: 12px
.qr-code-wrapper
  background: var(--white) 0% 0% no-repeat padding-box;
  border: 1px solid var(--medium-grey);
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border: 1px solid #C4C5C9;
  border-radius: 14px;
  opacity: 1;
  margin-bottom: 40px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 12px 6px 12px;
  width: auto;
  height: auto;
.onboarding-invite-link
  display: inline-block;
  cursor: copy;

.h-h1-signup
  margin-top: 20px

</style>

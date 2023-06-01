<script>
// import { mapActions } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'register-user-with-captcha-view',
  mixins: [validation],
  components: {
    Captcha: () => import('~/components/form/captcha.vue')
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
      submitting: false
    }
  },
  async mounted() {
    this.$emit('stepChanged', 'captcha')
  },
  methods: {
    // ...mapActions('verifier', ['requestChallenge', 'verifyChallenge']),
    async next() {
      const currentStep = this.steps[this.step]

      this.step = currentStep.nextStep

      await currentStep.action()
    },
    async setCaptchaResponse(data) {
      console.log('DATA: ', data)
      this.inviteLink = data.inviteLink
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container
  #top-indicator
    .indicator.row.q-gutter-sm.justify-center(v-if="$q.screen.lt.md || $q.screen.md")
      .ellipse-border( :class="step === 'captcha' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'inviteLink' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
  q-scroll-area.full-width.full-height(:thumb-style=" { 'opacity': '0' }" ref="scrollArea")#form-container
    .q-mb-xxs
    #internal-container
      #form1(v-show="step === this.steps.captcha.name")
        template
          .h-h1-signup Create New
            .text-bold Hypha Account
        .h-h2-signup Please verify you are not a BOT
        captcha(
          vue-recaptcha sitekey="6LfPcOUkAAAAAEXUdeFqdsJUob93TpWFEoHdj_yF"
          @setCaptchaResponse ="this.setCaptchaResponse"
          ev-bind:callback="callback")
      #form2(v-show="step === this.steps.inviteLink.name")
        template
          .row
            .col-9
              .h-h1-signup Proceede with
                .text-bold Hypha Wallet
            .col-3
          .row
            .col-4.signup-mobile-app-preview
              img(src="bg/hypha-wallet-preview.png", alt="Hypha Wallet Preview" class="full-width")
            .col-8
              .h-h2-signup Set-up Hypha Walleet
              .p-text-bold Scan the QR code on this page,
              .p-text-normal  it contains the invite to create the Hypha Account on your wallet.
              .p-text-bold Once the account is ready,
              .p-text-normal you are set for the last next step.
              a.invite-link(href="this.inviteLink") Copy invite link
      #form2(v-show="step === this.steps.finish.name")
        template
          .h-h1-signup Log-in with
            .text-bold Hypha Wallet
          .h-h2-signup Sign your first transaction
          p.text-normal Did you create your Hypha Account inside the Hypha Wallet? Great! Now click the button bellow and generate your first log-in transaction request, sign-it and you are good to go!
      #bottom-indicator.row.items-center
        .col
          .row.q-gutter-sm(v-if="$q.screen.gt.md")
            .ellipse-border( :class="'ellipse-filled'")
            .ellipse-border(:class="(step === this.steps.inviteLink.name || step === this.steps.finish.name ) && 'ellipse-filled'")
            .ellipse-border(:class="step === this.steps.finish.name && 'ellipse-filled'")
        .col-4(v-if="$q.platform.is.desktop")
          q-btn.full-width(
            :label="step === 'finish' ? 'Need Help?' : 'Next'"
            color="primary"
            unelevated
            @click="next"
            :disable="!this.inviteLink"
            :loading="submitting"
            rounded
            no-caps
          )
          .h-b3-signup.color-secondary.flex.column(v-if="$q.platform.is.mobile") Are you a member?
            span.h-b3-signup.text-primary.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") Login here
</template>

<style lang="stylus" scoped>
#form1
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
</style>

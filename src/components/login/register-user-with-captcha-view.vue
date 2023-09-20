<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import QrcodeVue from 'qrcode.vue'
import ipfsy from '~/utils/ipfsy'
import { Notify } from 'quasar'
import slugify from '~/utils/slugify'
import map from '~/utils/map'
import { MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER } from '~/const'

const HELP_LINK = 'https://help.hypha.earth/hc/2431449449'

export default {
  name: 'register-user-with-captcha-view',
  mixins: [validation],
  components: {
    Captcha: () => import('~/components/form/captcha.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    QrcodeVue
  },
  props: {
    step: String,
    inviteLink: String
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
      },
      create: {
        name: 'create-your-dao',
        index: 4
      },
      loading: {
        name: 'loading',
        index: 5
      }
    }
    return {
      HELP_LINK: HELP_LINK,
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
      }) || [],
      form: {
        // #
        name: this.getRandomEOSName(), // used internally to differentiate the DAO's. 12 characters, alphanumeric a-z, 1-5 lowercase
        title: '',
        description: '',

        // #
        template: -1, // i.e docId of the dao, -1 no template

        utilityDigits: 2, // 1.00
        utilityAmount: -1, // i.e 100000 or -1 for infinite supply
        utilityValue: '1', // The equivalent value of 1 token in USD
        // Voice token (aka voice_token = voiceDigits voiceSymbol)
        voiceSymbol: 'VOICE',
        voiceDigits: 2, // 1.00
        treasuryName: null,
        treasurySymbol: null,
        treasuryDigits: 2, // 1.00
        use_seeds: false,

        // #
        member: '',
        members: [],

        // #
        votingDurationSec: 604800, // 1 week
        periodDurationSec: 604800, // 1 week
        votingAlignmentPercent: 80, // 80% of yes votes
        votingQuorumPercent: 20, // 20% of people needs to vote
        utilityTokenMultiplier: 1,
        voiceTokenMultiplier: 1,
        treasuryTokenMultiplier: 1,
        logo: '',
        primaryColor: '#242f5d',
        secondaryColor: '#3f64ee',
        textColor: '#ffffff'
      }
    }
  },
  async mounted() {
    if (this.isAuthenticated) {
      this.$emit('stepChanged', this.steps.create.name)
    } else {
      this.$emit('stepChanged', this.step)
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    isImageSelected: {
      cache: false,
      get () { return this.$refs.ipfsInput?.imageURI }
    }
  },
  methods: {
    ...mapActions('dao', ['createDAO']),
    ...mapActions('accounts', ['loginWallet', 'loginInApp']),
    ipfsy,
    slugify,
    getRandomEOSName () {
      function choices (population, k) {
        const out = []
        for (let i = 0; i < k; i++) {
          out.push(population[Math.floor(population.length * Math.random())])
        }
        return out.join('')
      }
      const alphabet = 'abcdefghijklmnopqrstuvwxyz12345'
      return choices(alphabet, 12)
    },
    async next() {
      const currentStep = this.steps[this.step]

      await currentStep.action()
    },
    async onLoginWallet(idx) {
      if (this.$router.currentRoute.name === 'create-your-dao') {
        try {
          await this.loginWallet({ idx })
          if (this.account) {
            this.$emit('stepChanged', this.steps.create.name)
          }
        } catch (e) {
        }
      } else {
        await this.loginWallet({ idx, returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home' })
      }
    },
    async setCaptchaResponse(data) {
      this.$emit('setInviteLink', data.inviteLink)
    },
    copyText() {
      const storage = document.createElement('textarea')
      storage.value = this.inviteLink
      this.$refs.root.appendChild(storage)
      storage.select()
      storage.setSelectionRange(0, 99999)
      document.execCommand('copy')
      this.$refs.root.removeChild(storage)
    },
    async onSubmit () {
      const isDraft = !!this.$route.query.parentId
      const daoUrl = this.slugify(this.form.title, '-')
      try {
        await this.createDAO({
          data: {
            ...this.form,

            daoUrl,
            onboarder_account: this.account,
            parentId: this.$route.query.parentId,
            skipTokens: true,
            utilityTokenMultiplier: map(this.form.utilityTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER),
            voiceTokenMultiplier: map(this.form.voiceTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER),
            treasuryTokenMultiplier: map(this.form.treasuryTokenMultiplier, 0, 100, MIN_TOKEN_MULTIPLIER, MAX_TOKEN_MULTIPLIER)
          },
          isDraft
        })

        this.$emit('stepChanged', this.steps.loading.name)

        const query = await this.$apollo.watchQuery({
          query: require('~/query/dao-created.gql'),
          variables: { regexp: '/^' + daoUrl + '$/i' },
          pollInterval: 100,
          fetchPolicy: 'no-cache'
        })

        query.subscribe(({ data, loading }) => {
          const value = data.queryDao
          if (value.length > 0) {
            this.$store.dispatch('accounts/checkMembership')
            this.$router.push({ path: `/${daoUrl}/` })
          }
        })
      } catch (error) {
        this.error = error

        Notify.create({
          color: 'negative',
          icon: 'fas fa-exclamation-circle',
          message: error.message,
          position: 'bottom',
          timeout: 4000,
          actions: [
            { icon: 'fas fa-times', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
    },
    goToDocumentation() {
      window.location.href = this.HELP_LINK
    },
    downloadWallet() {
      if (navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
        window.location.href = process.env.DOWNLOAD_WALLET_LINK_IOS
      } else if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        window.location.href = process.env.DOWNLOAD_WALLET_LINK_ANDROID
      }
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container
  #top-indicator(v-if="step !== this.steps.create.name" ref="root")
    .indicator.row.q-gutter-sm.justify-center(v-if="$q.screen.lt.md || $q.screen.md")
      .ellipse-border(:class="step === 'captcha' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'inviteLink' && 'ellipse-filled'")
      .ellipse-border(:class="step === 'finish' && 'ellipse-filled'")
  #form-container.full-width.full-height(:thumb-style=" { 'opacity': '0' }")
    .q-mb-xxs
    .full-width.full-height.flex.column.justify-between.no-wrap(:style="{ 'padding-bottom': '50px' }")
      #internal-container.flex.justify-center.full-height
        #form1.flex.column.justify-center(v-show="step === this.steps.captcha.name")
          .row.flex.items-center.cursor-pointer(@click="$emit('back')")
            q-icon.q-mr-xxs(name="fas fa-arrow-left" color="primary" size="14px")
            .text-bold.text-primary {{ $t('login.login-view.back') }}
          template
            .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ $t('login.register-user-with-captcha-view.createNew') }}
          .text-medium.q-mt-md {{ $t('login.register-user-with-captcha-view.pleaseVerifyYou') }}
          .flex.justify-center(:style="{ 'margin-top': '80px' }")
            captcha(ref="captcha" vue-recaptcha="vue-recaptcha" sitekey="6LfPcOUkAAAAAEXUdeFqdsJUob93TpWFEoHdj_yF" @setCaptchaResponse="this.setCaptchaResponse" ev-bind:callback="callback")

        #form2.flex.column.justify-between.no-wrap(v-show="step === this.steps.inviteLink.name")
          template
            div.full-height.column.justify-center
              .row.flex.items-center.cursor-pointer(@click="$emit('stepChanged', steps.captcha.name)")
                q-icon.q-mr-xxs(name="fas fa-arrow-left" color="primary" size="14px")
                .text-bold.text-primary {{ $t('login.login-view.back') }}
              .row
                .row
                  .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ $t('login.register-user-with-captcha-view.proceedWith') }}
              .row.q-mt-sm
                .col.font-lato
                  .p-onboarding.bold {{ $t('login.register-user-with-captcha-view.scanTheQr') }}
                  .p-onboarding {{ $t('login.register-user-with-captcha-view.itContainsThe') }}
                  .p-onboarding.bold {{ $t('login.register-user-with-captcha-view.onceTheAccount') }}
                  .p-onboarding {{ $t('login.register-user-with-captcha-view.youAreSet') }}
            .row.justify-center.items-center(v-if="$q.screen.gt.md" :style="{ 'margin-bottom': '60px' }")
              .qr-code-wrapper
                qrcode-vue(:value="inviteLink" size="150")
              img.q-ml-xl(:style="{ 'width': '150px', 'height': '150px' }" src="~/assets/images/onboarding-hypha-logo.png")
            .row(v-else :style="{ 'margin-bottom': '200px' }")
        #form3.flex.column.justify-center(v-show="step === this.steps.finish.name")
          template
            div.full-height.column.justify-center
              .row.flex.items-center.cursor-pointer(@click="$emit('stepChanged', steps.inviteLink.name)")
                q-icon.q-mr-xxs(name="fas fa-arrow-left" color="primary" size="14px")
                .text-bold.text-primary {{ $t('login.login-view.back') }}
              .font-lato.text-heading.text-weight-bolder.q-mb-md(:style="{ 'font-size': '34px' }") {{ $t('login.register-user-with-captcha-view.loginWith') }}
              .q-mt-md
                .row
                  .col-4.q-mr-sm(:style="'min-width: 120px'")
                    img(:style="{ 'width': 'fit-content' }" src="~/assets/images/onboarding-mobile.svg")
                  .col.q-ml-md
                    .text-bold.text-black.q-mt-md {{ $t('login.register-user-with-captcha-view.signYourFirstTransaction') }}
                    p.text-normal.q-mt-xs {{ $t('login.register-user-with-captcha-view.didYouCreate') }}
                    .row.flex.justify-center.items-center.q-mt-xl
                    .text-primary.text-bold.cursor-pointer(@click="goToDocumentation()") {{ $t('login.register-user-with-captcha-view.needHelp') }}
        #form4.flex.column.justify-between.no-wrap.full-height(v-show="step === this.steps.create.name")
          div.full-height.column.justify-end
            .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ $t('login.register-user-with-captcha-view.createYourDao') }}
            .q-mt-md {{ $t('login.register-user-with-captcha-view.goAheadAndAddYour') }}
          div
            div.full-width.justify-between.q-mt-xl(:class="{ 'col': !$q.screen.gt.md, 'row': $q.screen.gt.md }")
              .col(:class="{ 'full-width q-pt-md': !$q.screen.gt.md }")
                .row.justify-center.items-end
                  .col-auto.q-mb-xxxs
                    loading-spinner.q-mb-xxs(v-if="$refs.ipfsInput?.isUploading" color="primary" size="2em")
                    q-avatar.flex.justify-center.items-center(v-else size="40px" color="primary" text-color="white")
                      q-btn(v-if="!isImageSelected" @click="$refs.ipfsInput.chooseFile()" icon="fa fa-image" color="white" flat round size="12px" unelevated)
                      img(v-if="isImageSelected" :src="$refs.ipfsInput.imageURI")
                  .col.q-ml-md
                    label.h-label {{ $t('pages.onboarding.logoIcon') }}
                    q-btn.full-width.rounded-border.text-bold.q-mt-xs(:class="{ 'q-px-xl': $q.screen.gt.md }" @click="$refs.ipfsInput.chooseFile()" color="primary" :label="$t('pages.onboarding.uploadAnImage')" no-caps outline rounded unelevated)
                    input-file-ipfs(@uploadedFile="form.logo = arguments[0] " image="image" ref="ipfsInput" v-show="false")
              .col.q-ml-md(:class="{ 'full-width q-mt-md': !$q.screen.gt.md, 'q-pr-md': $q.screen.gt.md }")
                label.h-label {{ $t('pages.onboarding.name') }}
                q-input.q-mt-xs.rounded-border(:rules="[rules.required, rules.min(3)]" dense lazy-rules="ondemand" maxlength="50" outlined :placeholder="$t('pages.onboarding.theDisplayNameOfYourDao')" ref="title" v-model="form.title")
            .row.full-width.justify-between
              .col-12.q-mt-md(:class="{ 'full-width': !$q.screen.gt.md }")
                label.h-label {{ $t('pages.onboarding.purpose') }}
                q-input.q-mt-xs.rounded-border(:input-style="{ 'resize': 'none' }" :rules="[rules.required]" dense lazy-rules="ondemand" maxlength="300" outlined :placeholder="$t('pages.onboarding.brieflyExplainWhatYourDao')" ref="description" rows="10" type="textarea" v-model="form.description")
            nav.row.justify-end.q-mt-xl.q-gutter-xs
              q-btn.q-px-xl(@click="onSubmit" color="primary" :label="$t('login.register-user-with-captcha-view.publishYourDao')" no-caps rounded unelevated)

        #form5.flex.items-center.justify-center.no-wrap(v-show="step === this.steps.loading.name")
          loading-spinner(color="primary" size="72px")

      #bottom-indicator.row.items-center(v-if="![this.steps.create.name, this.steps.loading.name].includes(step)")
        .col(v-if="$q.screen.gt.md")
          .row.q-gutter-sm(v-if="$q.screen.gt.md")
            .ellipse-border(:class="'ellipse-filled'")
            .ellipse-border(:class="(step === this.steps.inviteLink.name || step === this.steps.finish.name ) && 'ellipse-filled'")
            .ellipse-border(:class="step === this.steps.finish.name && 'ellipse-filled'")
        .no-wrap.flex.justify-end.items-center(:class="{ 'col-10': $q.screen.gt.md, 'col': !$q.screen.gt.md, 'full-width': !$q.screen.gt.md}")
          q-btn.full-width(v-if="step === this.steps.inviteLink.name && !$q.screen.gt.md" :label="$t('login.register-user-with-captcha-view.downloadWallet')" color="primary" outline unelevated @click="downloadWallet()" rounded no-caps)
          q-btn(v-if="step === this.steps.inviteLink.name && $q.screen.gt.md" :label="$t('login.register-user-with-captcha-view.copyInviteLink')" color="primary" outline unelevated @click="copyText()" rounded no-caps)
          q-btn(v-if="step !== this.steps.finish.name").q-mx-md.q-px-md(:style="{ 'height': 'fit-content' }" :label="step === 'finish' ? 'Need Help?' : 'Next'" color="primary" unelevated @click="next" :disable="!this.inviteLink" :loading="submitting" :outline="step === this.steps.finish.name" rounded no-caps)
          q-list(v-if="step === steps.finish.name")
            q-item.wallet.q-my-xs(v-for="(wallet, idx) in this.hyphaAuthenticators" :key="wallet.getStyle().text" v-ripple :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }")
              q-item-section.cursor-pointer(avatar @click="onLoginWallet(idx)")
                img(:src="wallet.getStyle().icon" width="20")
              q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ $t('login.register-user-with-captcha-view.login', { '1': wallet.getStyle().text, '2': wallet.getStyle().text === 'Seeds' ? '(beta)' : '' }) }}
              q-item-section(avatar)
                .flex
                  loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
                  q-btn(v-else :color="wallet.getStyle().textColor" icon="fas fa-cloud-download-alt" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense flat size="10px")
                    q-tooltip {{ $t('login.register-user-with-captcha-view.getApp') }}
          //- .h-b3-signup.color-secondary.flex.column(v-if="!$q.screen.gt.md") {{ $t('login.register-user-with-captcha-view.areYouAMember') }}
          //-   span.h-b3-signup.text-primary.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") {{ $t('login.register-user-with-captcha-view.loginHere') }}

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
 background: #CAC8D0
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 12px 6px 12px;
  width: fit-content
  height: auto;
.onboarding-invite-link
  display: inline-block;
  cursor: copy;

.h-h1-signup
  margin-top: 20px

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
import QrcodeVue from 'qrcode.vue'
import ipfsy from '~/utils/ipfsy'
import { Notify } from 'quasar'
import slugify from '~/utils/slugify'

const HELP_LINK = 'https://hypha.earth/get-started/create-hypha-account/'

export default {
  name: 'register-user-with-captcha-view',
  mixins: [validation],
  components: {
    Captcha: () => import('~/components/form/captcha.vue'),
    InputFileIpfs: () => import('~/components/ipfs/input-file-ipfs.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    QrcodeVue,
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue')
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
      },
      account: {
        name: 'account',
        index: 6
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
        utilityTokenMultiplier: 100,
        voiceTokenMultiplier: 100,
        treasuryTokenMultiplier: 100,
        logo: '',
        primaryColor: '#242f5d',
        secondaryColor: '#3f64ee',
        textColor: '#ffffff'
      },
      showLoadingModal: false,
      progress: 0,
      daoCreated: false
    }
  },
  async mounted() {
    if (await this.isAuthenticated) {
      await this.$emit('stepChanged', this.steps.create.name)
    } else {
      this.$emit('stepChanged', this.step)
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),
    isImageSelected: {
      cache: false,
      get () { return this.$refs.ipfsInput?.imageURI }
    }
  },
  watch: {
    progress: function (value) {
      if (value === 1) {
        this.daoCreated = true
      }
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
          if (await this.account) {
            await this.$emit('stepChanged', this.steps.create.name)
          }
        } catch (e) {
        }
      } else {
        await this.loginWallet({ idx })
        if (await this.account) {
          await this.$emit('stepChanged', this.steps.account.name)
        }
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
    updateProgressBar() {
      return new Promise((resolve, reject) => {
        const totalSteps = 10
        const stepDuration = 500

        let currentStep = 0

        const updateProgress = () => {
          if (currentStep < totalSteps) {
            this.progress = (currentStep / totalSteps)
            currentStep++
            setTimeout(updateProgress, stepDuration)
          } else {
            this.progress = 1
            resolve()
          }
        }
        setTimeout(updateProgress, stepDuration)
      })
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
            skipTokens: true

          },
          isDraft
        })
        this.$emit('stepChanged', this.steps.loading.name)
        this.showLoadingModal = true
        await this.updateProgressBar()

        const query = await this.$apollo.watchQuery({
          query: require('~/query/dao-created.gql'),
          variables: { regexp: '/^' + daoUrl + '$/i', username: this.account },
          pollInterval: 100,
          fetchPolicy: 'no-cache'
        })

        query.subscribe(({ data, loading }) => {
          const value = data.queryDao

          if (value.length > 0 && value[0]?.admin?.length > 0) {
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
      window.open(
        this.HELP_LINK,
        '_blank'
      )
    },
    downloadWallet() {
      if (navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
        window.open(
          process.env.DOWNLOAD_WALLET_LINK_IOS,
          '_blank'
        )
      } else if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        window.open(
          process.env.DOWNLOAD_WALLET_LINK_ANDROID,
          '_blank'
        )
      }
    },
    enterDao() {
      this.$router.push({ name: 'explore' })
    }
  }
}

</script>
<template lang="pug">
.full-width.full-height.flex.items-start.main-container(:class="{ 'q-pa-xl': !$q.screen.gt.md }")
  #form-container.full-width.full-height(:thumb-style=" { 'opacity': '0' }")
    .q-mb-xxs
    .full-width.full-height.flex.column.justify-between.no-wrap(:style="{ 'padding-bottom': '50px' }")
      #internal-container.flex.justify-center.full-height
        #form1.flex.column(v-show="step === this.steps.captcha.name" :class="{ 'justify-start': !$q.screen.gt.md, 'justify-center': $q.screen.gt.md }")
          .row.flex.items-center.cursor-pointer(@click="$emit('back')")
            q-icon.q-mr-xxs(name="fas fa-chevron-left" color="primary" size="14px")
            .text-bold.text-primary {{ $t('login.login-view.back') }}
          div(:style="'line-height: 44px;'" :class="{ 'desktop-line-height': $q.screen.gt.md }")
            .font-lato.text-heading.text-bold(:class="{ 'desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ $t('login.register-user-with-captcha-view.createNew') }}
            .font-lato.text-heading.text-bold(:class="{ 'desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ $t('login.register-user-with-captcha-view.hyphaAccount') }}
          .text-medium.q-mt-md(:class="{ 'text-bold': !$q.screen.gt.md, 'text-heading': !$q.screen.gt.md, 'h3': !$q.screen.gt.md }") {{ $t('login.register-user-with-captcha-view.pleaseVerifyYou') }}
          .flex.justify-center(:style="{ 'margin-top': '40px' }")
            captcha(ref="captcha" vue-recaptcha="vue-recaptcha" sitekey="6LfPcOUkAAAAAEXUdeFqdsJUob93TpWFEoHdj_yF" @setCaptchaResponse="this.setCaptchaResponse" ev-bind:callback="callback")

        #form2.flex.column.justify-between.no-wrap(v-show="step === this.steps.inviteLink.name")
          template
            div.full-height.column.justify-center
              .row.flex.items-center.cursor-pointer(@click="$emit('stepChanged', steps.captcha.name)")
                q-icon.q-mr-xxs(name="fas fa-chevron-left" color="primary" size="14px")
                .text-bold.text-primary {{ $t('login.login-view.back') }}
              .row
                .row
                  .font-lato.text-heading.text-bold(:class="{ 'desktop-line-height desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px', 'line-height': '44px', 'white-space': 'pre-line' }") {{ $t('login.register-user-with-captcha-view.proceedWith') }}
              .row.q-mt-sm
                .col.font-lato.text-heading
                  .p-onboarding(v-if="!$q.screen.gt.md") {{ $t('login.register-user-with-captcha-view.scanTheQr') }}
            q-btn.full-width.text-bold.q-mt-xxl(v-if="!$q.screen.gt.md" :icon="`img:${require('~/assets/icons/hypha-round-light.png')}`" :label="$t('login.register-user-with-captcha-view.downloadWallet')" color="primary" unelevated @click="downloadWallet()" rounded no-caps)
            .row.justify-center.items-center(v-if="$q.screen.gt.md" :style="{ 'margin-bottom': '100px' }")
              .qr-code-wrapper
                qrcode-vue(:value="inviteLink" size="128")
              img.q-ml-xl(:style="{ 'width': '150px', 'height': '150px' }" src="~/assets/images/onboarding-hypha-logo.png")
            .row(v-else :style="{ 'margin-bottom': '200px' }")
            .p-onboarding(v-if="$q.screen.gt.md") {{ $t('login.register-user-with-captcha-view.itContainsThe') }}
        #form3.flex.column.justify-center(v-show="step === this.steps.finish.name")
          template
            div.full-height.column.justify-center
              .row.flex.items-center.cursor-pointer(@click="$emit('stepChanged', steps.inviteLink.name)")
                q-icon.q-mr-xxs(name="fas fa-chevron-left" color="primary" size="14px")
                .text-bold.text-primary {{ $t('login.login-view.back') }}
              .font-lato.text-heading.text-bold.q-mb-md(:class="{ 'desktop-line-height desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px', 'white-space': 'pre-line', 'line-height': '44px' }") {{ $t('login.register-user-with-captcha-view.loginWith') }}
              .q-mt-md(v-if="$q.screen.gt.md")
                .row
                  .col-4.q-mr-sm(:style="'min-width: 120px'")
                    img(:style="{ 'width': 'fit-content' }" src="~/assets/images/onboarding-mobile.svg")
                  .col.q-ml-md
                    .text-bold.text-heading.q-mt-md(:style="'font-size: 22px'") {{ $t('login.register-user-with-captcha-view.signYourFirstTransaction') }}
                    p.text-normal.q-mt-xs {{ $t('login.register-user-with-captcha-view.didYouCreate') }}
                    .row.flex.justify-center.items-center.q-mt-xl
                    .text-primary.text-bold.cursor-pointer.text-underline(@click="goToDocumentation()") {{ $t('login.register-user-with-captcha-view.needHelp') }}
              .col(v-else)
                .text-bold.text-heading(:style="'font-size: 22px'") {{ $t('login.register-user-with-captcha-view.signYourFirstTransaction') }}
                p.text-normal.q-mt-xs {{ $t('login.register-user-with-captcha-view.didYouCreate') }}
                .row.flex.justify-center.items-center.q-mt-xl
                .text-primary.text-bold.cursor-pointer.text-underline(@click="goToDocumentation()") {{ $t('login.register-user-with-captcha-view.needHelp') }}
        #form4.flex.column.justify-between.no-wrap.full-height(v-show="step === this.steps.create.name")
          div.full-height.column.justify-end
            .font-lato.text-heading.text-bold(:class="{ 'desktop-line-height desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px' }") {{ $t('login.register-user-with-captcha-view.createYourDao') }}
            .q-mt-md {{ $t('login.register-user-with-captcha-view.goAheadAndAddYour') }}
          div
            div.full-width.justify-between(:class="{ 'col': !$q.screen.gt.md, 'row': $q.screen.gt.md, 'q-mt-xl': $q.screen.gt.md, 'q-mt-xs': !$q.screen.gt.md }")
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
            .row.full-width.justify-between(:class="{ 'bottom-padding': !$q.screen.gt.md }")
              .col-12(:class="{ 'full-width': !$q.screen.gt.md, 'q-mt-md': $q.screen.gt.md }")
                label.h-label {{ $t('pages.onboarding.purpose') }}
                q-input.q-mt-xs.rounded-border(:input-style="{ 'resize': 'none' }" :rules="[rules.required]" dense lazy-rules="ondemand" maxlength="300" outlined :placeholder="$t('pages.onboarding.brieflyExplainWhatYourDao')" ref="description" rows="4" type="textarea" v-model="form.description")
            nav.row.justify-end.q-mt-xl.q-gutter-xs
              q-btn.q-px-xl(v-if="$q.screen.gt.md" @click="onSubmit" color="primary" :label="$t('login.register-user-with-captcha-view.publishYourDao')" no-caps rounded unelevated)
        #form5.flex.items-center.justify-center.no-wrap(v-show="step === this.steps.loading.name")
          q-dialog(v-if="$q.screen.gt.md" :value="showLoadingModal" persistent)
            widget.bg-white.q-pa-xxxl.width-auto.col-auto.full-width(:style="'border-radius: 25px; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2); max-width: 1180px;'")
              .row
                .col-3
                  div.flex.justify-center.items-center.bg-positive(v-if="daoCreated === true" :style="'width: 220px; height: 220px; border-radius: 50%;'")
                    q-icon.text-white(size="90px" name="fas fa-check")
                  q-avatar.flex.justify-center.items-center(v-else size="220px" color="primary" text-color="white")
                    img(v-if="isImageSelected" :src="$refs.ipfsInput.imageURI")
                .col.flex.items-center
                  .row
                    .h-h3 {{ $t('pages.onboarding.publishingTheDao' )}}
                    .text-grey.q-mt-sm {{ $t('pages.onboarding.pleaseBearWithUs' )}}
                    q-linear-progress(:value="progress" :color="daoCreated === true ? 'positive' : 'primary'" class="q-mt-md")
                    .row.q-mt-sm.flex.justify-between.full-width
                      .text-primary.q-mt-sm.text-bold(v-if="daoCreated === true") {{ $t('pages.onboarding.allDone' )}}
                      .text-primary.q-mt-sm.text-bold(v-else) {{ $t('pages.onboarding.creatingSlotsFor', { title: form.title } )}}
                      .text-primary.text-bold(:class="{ 'text-positive': daoCreated === true }") {{ progress * 100 }}%
          loading-spinner(v-else color="primary" size="72px")
        #form6.flex.column.justify-center.full-height(v-show="step === this.steps.account.name")
          template
            div.full-height.column.justify-center
              .row.full-width.justify-between.flex
                .font-lato.text-heading.text-bold(:class="{ 'desktop-line-height desktop-font-size': $q.screen.gt.md }" :style="{ 'font-size': '38px', 'line-height': '44px', 'white-space': 'pre-line' }") {{ $t('login.register-user-with-captcha-view.welcomeUser', { username: account }) }}
                profile-picture(v-if="$q.screen.gt.md" :username="account" size="100px" :key="user")
              .col.full-height.items-center.flex
                .col
                  .row.flex.items-center(v-if="$q.screen.gt.md")
                    .text-heading.text-bold(:style="'font-size: 22px'") {{ $t('login.register-user-with-captcha-view.accountConnected') }}
                    q-icon.q-ml-sm.text-secondary(name="fas fa-check" size="24px")
                  .row.flex.items-center.q-mb-md(v-else)
                    .col.q-mr-lg
                      profile-picture(:username="account" size="100px" :key="user")
                    .col.q-mr-lg
                      .text-heading.text-bold(:style="'font-size: 22px'") {{ $t('login.register-user-with-captcha-view.accountConnected') }}
                    .col.flex.justify-center.items-center
                      q-icon.q-ml-sm.text-secondary(name="fas fa-check" size="24px")
                  .row {{ $t('login.register-user-with-captcha-view.youCanNowUserYour', { dao: selectedDao.title }) }}
      template(v-if="this.steps.account.name === step")
        .row
          .col
          .col.flex.justify-end
            q-btn.q-px-xl.text-bold(@click="enterDao()" color="primary" :label="$t('login.register-user-with-captcha-view.enter')" no-caps rounded unelevated)
      template(v-if="$q.screen.gt.md")
        #bottom-indicator.row.items-center(v-if="![this.steps.create.name, this.steps.loading.name, this.steps.account.name].includes(step)")
          .col
            .row.q-gutter-sm
              .ellipse-border(:class="'ellipse-filled'")
              .ellipse-border(:class="(step === this.steps.inviteLink.name || step === this.steps.finish.name ) && 'ellipse-filled'")
              .ellipse-border(:class="step === this.steps.finish.name && 'ellipse-filled'")
          .no-wrap.flex.justify-end.items-center(:class="{ 'col-10': $q.screen.gt.md, 'col': !$q.screen.gt.md, 'full-width': !$q.screen.gt.md}")
            q-btn.full-width(v-if="step === this.steps.inviteLink.name && !$q.screen.gt.md" :label="$t('login.register-user-with-captcha-view.downloadWallet')" color="primary" outline unelevated @click="downloadWallet()" rounded no-caps)
            q-btn(v-if="step !== this.steps.finish.name").q-mx-md.q-px-md(:style="{ 'height': 'fit-content' }" :label="step === 'finish' ? 'Need Help?' : 'Next'" color="primary" unelevated @click="next" :disable="!this.inviteLink" :loading="submitting" :outline="step === this.steps.finish.name" rounded no-caps)
            q-list(v-if="step === steps.finish.name")
              q-item.wallet.q-my-xs(v-for="(wallet, idx) in this.hyphaAuthenticators" :key="wallet.getStyle().text" v-ripple :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }")
                q-item-section.cursor-pointer(avatar @click="onLoginWallet(idx)")
                  img(:src="wallet.getStyle().icon" width="20")
                q-item-section.cursor-pointer.text-center.text-bold(@click="onLoginWallet(idx)") {{ $t('login.register-user-with-captcha-view.login', { '1': wallet.getStyle().text, '2': wallet.getStyle().text === 'Seeds' ? '(beta)' : '' }) }}
                q-item-section(avatar)
                  .flex
                    loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
                    q-btn(v-else :color="wallet.getStyle().textColor" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense flat size="10px")
                      q-tooltip {{ $t('login.register-user-with-captcha-view.getApp') }}
            //- .h-b3-signup.color-secondary.flex.column(v-if="!$q.screen.gt.md") {{ $t('login.register-user-with-captcha-view.areYouAMember') }}
            //-   span.h-b3-signup.text-primary.cursor-pointer(style="text-decoration: underline" @click="$emit('onClickLoginPage')") {{ $t('login.register-user-with-captcha-view.loginHere') }}
      template(v-else)
        q-card.full-width.q-pa-xl(v-if="this.steps.account.name !== step" :style="'border-radius: 25px 25px 0 0; box-shadow: none; z-index: 9000; position: fixed; bottom: 0px; left: 0; right: 0; box-shadow: 0px 0px 26px 0px rgba(0, 0, 41, 0.2);'")
          .row.items-center(v-if="![this.steps.create.name, this.steps.loading.name, this.steps.account.name].includes(step)")
            .col
              .row.q-gutter-sm
                .ellipse-border(:class="'ellipse-filled'")
                .ellipse-border(:class="(step === this.steps.inviteLink.name || step === this.steps.finish.name ) && 'ellipse-filled'")
                .ellipse-border(:class="step === this.steps.finish.name && 'ellipse-filled'")
            .no-wrap.flex.justify-end.items-center(:class="{ 'col-10': $q.screen.gt.md, 'col': !$q.screen.gt.md, 'full-width': !$q.screen.gt.md}")
              q-btn(v-if="step === this.steps.inviteLink.name && $q.screen.gt.md" :label="$t('login.register-user-with-captcha-view.copyInviteLink')" color="primary" outline unelevated @click="copyText()" rounded no-caps)
              q-btn(v-if="step !== this.steps.finish.name").q-mx-md.q-px-md.full-width(:style="{ 'height': 'fit-content' }" :label="step === 'finish' ? 'Need Help?' : 'Next'" color="primary" unelevated @click="next" :disable="!this.inviteLink" :loading="submitting" :outline="step === this.steps.finish.name" rounded no-caps)
              q-list(v-if="step === steps.finish.name")
                q-item.wallet.q-my-xs.text-bold(v-for="(wallet, idx) in this.hyphaAuthenticators" :key="wallet.getStyle().text" v-ripple :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor, 'white-space': 'nowrap' }")
                  q-item-section.cursor-pointer(avatar @click="onLoginWallet(idx)")
                    img(:src="wallet.getStyle().icon" width="20")
                  q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ $t('login.register-user-with-captcha-view.loginMobile') }}
                  q-item-section(avatar)
                    .flex
                      loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
                      q-btn(v-else :color="wallet.getStyle().textColor" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense flat size="10px")
                        q-tooltip {{ $t('login.register-user-with-captcha-view.getApp') }}
          template(v-if="step === this.steps.create.name")
            .row
              .col
              .col-7.flex.justify-end
                q-btn.q-px-xl(@click="onSubmit" color="primary" :label="$t('login.register-user-with-captcha-view.publishYourDao')" no-caps rounded unelevated)
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
 background: transparent
 border: 1px solid #242f5d
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
.h3
  font-size: 18px
.desktop-font-size
  font-size: 44px !important
.desktop-line-height
  line-height: 52px !important
.bottom-padding
  padding-bottom: 100px
</style>

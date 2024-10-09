<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: {
    WelcomeView: () => import('~/components/login/welcome-view.vue'),
    HeaderView: () => import('~/components/login/header-view.vue'),
    LoginView: () => import('~/components/login/login-view.vue'),
    RegisterUserView: () => import('~/components/login/register-user-view.vue'),
    RegisterUserWithCaptchaView: () => import('~/components/login/register-user-with-captcha-view.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },
  methods: {
    ...mapActions('accounts', ['loginWallet']),
    redirectToRegister() {
      window.location.href = `${process.env.PANGEA_REGISTER_URL}`
    },
    async onLoginWallet (idx) {
      if (this.$router.currentRoute.name === 'create-your-dao') {
        await this.loginWallet({ idx, returnUrl: 'create-your-dao' })
      } else {
        await this.loginWallet({ idx, returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || `/${this.$route.params.dhoname}` })
      }
    }
  },
  data () {
    return {
      step: 'welcome',
      steps: {
        welcome: 'welcome',
        login: 'login',
        register: 'register'
      },
      registerStep: this.isAuthenticated ? 'create' : 'captcha',
      stepPK: undefined,
      showingCard: true,
      dhoname: undefined,
      inviteLink: null
    }
  },
  mounted () {
    if (this.$router.currentRoute.params) {
      this.dhoname = this.$router.currentRoute.params.dhoname
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    ...mapGetters('accounts', ['isAuthenticated']),
    animationSwirl () {
      switch (this.step) {
        case 'welcome':
          return 'swirl-step-one'
        case 'login':
          return 'swirl-step-two'
        case 'register':
          // ('animationSwirl')
          if (this.registerStep === 'captcha') {
            return 'swirl-step-two'
          } else if (this.registerStep === 'inviteLink') {
            return 'swirl-step-three'
          } else if (this.registerStep === 'finish') {
            return 'swirl-step-four'
          } else {
            return 'swirl-step-two'
          }
        default: return 'swirl-step-one'
      }
    },
    animationSwirlMobile () {
      switch (this.step) {
        case 'welcome':
          return 'swirl-step-one-mobile'
        case 'login':
          return 'swirl-step-two-mobile'
        case 'register':
          // ('animationSwirl')
          if (this.registerStep === 'captcha') {
            return 'swirl-step-two-mobile'
          } else if (this.registerStep === 'inviteLink') {
            return 'swirl-step-three-mobile'
          } else if (this.registerStep === 'finish') {
            return 'swirl-step-four-mobile'
          } else {
            return 'swirl-step-two-mobile'
          }
        default: return 'swirl-step-one-mobile'
      }
    },
    animationBG () {
      switch (this.step) {
        case 'welcome':
          return 'welcome-bg'
        case 'login':
          return 'welcome-bg-step-two'
        case 'register':
          if (this.registerStep === 'captcha') {
            return 'welcome-bg-step-two'
          } else if (this.registerStep === 'inviteLink') {
            return 'welcome-bg-step-three'
          } else if (this.registerStep === 'finish') {
            return 'welcome-bg-step-four'
          } else {
            return 'welcome-bg-step-two'
          }
        default: return 'welcome-bg'
      }
    },
    animationBGMobile () {
      switch (this.step) {
        case 'welcome':
          return 'welcome-bg-mobile'
        case 'login':
          return 'welcome-bg-step-two-mobile'
        case 'register':
          if (this.registerStep === 'captcha') {
            return 'welcome-bg-step-two-mobile'
          } else if (this.registerStep === 'inviteLink') {
            return 'welcome-bg-step-three-mobile'
          } else if (this.registerStep === 'finish') {
            return 'welcome-bg-step-four-mobile'
          } else {
            return 'welcome-bg-step-two-mobile'
          }
        default: return 'welcome-bg-mobile'
      }
    },
    animationCardMobile () {
      switch (this.step) {
        case 'login':
          return 'bottom-card-step-two'
        case 'register':
          return 'bottom-card-step-two'
        default: return 'bottom-card'
      }
    },

    isOnboarding () { return this.$route.query.type === 'onboard' }
  }
}
</script>

<template lang="pug">
.fullscreen
  .relative-position.full-height.full-widthrt(v-if="$q.screen.gt.md")
    .welcome-bg.full-height.full-width(:class="animationBG")
    .welcome-fg.full-height.full-width
    .row.full-height.card-container
      .col-xl-5.col-sm-6.col-xs-12.left-container(v-if="showingCard")
        q-card.custom-full-height.card-container.left-card
          header-view(:step="step" :steps="steps" @logoClick="step = steps.welcome" :logo="selectedDao.logo" :daoName="selectedDao.title")
          transition(v-if="step === steps.welcome" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            welcome-view.full-width(@onLoginClick="onLoginWallet(0)" @onRegisterClick="redirectToRegister" @onCreateDaoClick="step = steps.register" v-bind="{ isOnboarding }")
          transition(v-else-if="step === steps.login" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            login-view(:dhoName="dhoname" :pk="stepPK" @transitionToRegister="step = steps.register" @onLoginWithPK=" v => stepPK = true" @back="step = steps.welcome, inviteLink = null" v-bind="{ isOnboarding }")
          transition(v-else-if="step === steps.register" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
            register-user-with-captcha-view(@setInviteLink="v => inviteLink = v" :inviteLink="inviteLink" :step="registerStep" @stepChanged="v => registerStep = v" @onFinish="step = steps.login" @back="step = steps.welcome, inviteLink = null" v-bind="{ isOnboarding }")
      .col.full-height.card-container.relative-position.gt-xs
        .welcome-info.absolute-center
          ipfs-image-viewer(:ipfsCid="selectedDao.logo" showDefault :defaultLabel="daoName" size="300px")
  .relative-position.full-height.full-width.custom-scroll-area(v-if="$q.screen.lt.md || $q.screen.md")
    .welcome-bg-mobile.full-height.full-width(:class="animationBGMobile")
    .welcome-fg.full-height.full-width
    img.hyphaLogo(src="~assets/logos/hypha-horizontal-light.png")
    q-card.card-container.bottom-card(:class="animationCardMobile")
      q-scroll-area.full-width.full-height(:thumb-style="{ 'opacity': '0'}" :content-style="{ 'height': '100%' }" ref="scrollArea")
        transition(v-if="step === steps.welcome" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          welcome-view.full-width.full-height(@onLoginClick="step = steps.login" @onRegisterClick="step = steps.register")
        transition(v-else-if="step === steps.login" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          login-view.full-height(:dhoName="dhoname" :pk="stepPK" @onLoginWithPK=" v => stepPK = true" @back="step = steps.welcome, inviteLink = null")
        transition(v-else-if="step === steps.register" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          register-user-with-captcha-view.full-height(@setInviteLink="v => inviteLink = v" :inviteLink="inviteLink" :step="registerStep" @back="step = steps.welcome, inviteLink = null" @stepChanged="v => registerStep = v" @onFinish="step = steps.login" @onClickLoginPage="step = steps.login")
      bottom-section(:daoSettings="daoSettings" v-if="step === steps.login || step === steps.register && registerStep !== 'finish'" :stepPK="stepPK" :step="step" :steps="steps" @onClickRegisterHere="step = steps.register; stepPK = false" @onClickLogin="stepPK = false" @onClickLoginPage="step = steps.login; stepPK = false")

</template>

<style lang="stylus" scoped>
.index
  z-index: 6
  top: 90vh
  position: absolute
.custom-full-height
  height: 100vh
.welcome-bg
  background-image: url('../../assets/images/loginBg.png')
  background-repeat: no-repeat
  background-size: cover
  position: absolute
  transition: all 1s;
  transform: translateX(15%)
.welcome-bg-step-two
  transform: translateX(10%)
.welcome-bg-step-three
  transform: translateX(5%)
.welcome-bg-step-four
  transform: translateX(0%)
.welcome-fg
    background: $primary
    position: absolute
    z-index: 2
    opacity: 0.85
.card-container
    z-index: 5
.hypha-logo
    background-image: url('../../assets/logos/hypha-logo-blue.svg')
    width: 530px
    height: 163px
    background-repeat: no-repeat
    background-size: contain
.left-card
  padding 50px 80px
.bottom-card
  border-radius: 25px 25px 0 0
  position: absolute
  top: 120px
  left: 0
  right: 0
  bottom: 0
  @media (orientation: landscape) and (min-width: 1024px)
    height: auto !important
  @media (max-width: 375px)
    height: 100% !important
    max-height: 88%
  @media (max-width: 375px)
    top: auto
.bottom-card-step-two
  // top: 130px
  transition: all 1s
  transition-timing-function: ease-out
.left-container
  @media (min-width: $breakpoint-xl)
    max-width 575px
.welcome-bg-mobile
  background-image: url('../../assets/images/loginBg.png')
  background-repeat: no-repeat
  background-size: cover
  position: absolute
  transition: all 1s;
  background-position: center;
.welcome-bg-step-two-mobile
  background-position-x: 55%
.welcome-bg-step-three-mobile
  background-position-x: 65%
.welcome-bg-step-four-mobile
  background-position-x: 70%
.hyphaLogo
  width: 150px
  margin: 20px 0 0 20px
  z-index: 10
  position: relative
.custom-scroll-area
  @media (orientation: landscape)
    overflow-y: auto
    overflow-x: hidden
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  components: {
    WelcomeView: () => import('~/components/login/welcome-view.vue'),
    HeaderView: () => import('~/components/login/header-view.vue'),
    LoginView: () => import('~/components/login/login-view.vue'),
    RegisterUserView: () => import('~/components/login/register-user-view.vue'),
    BottomSection: () => import('~/components/login/bottom-section.vue'),
    IpfsImageViewer: () => import('~/components/ipfs/ipfs-image-viewer.vue')
  },
  data () {
    return {
      step: 'welcome',
      steps: {
        welcome: 'welcome',
        login: 'login',
        register: 'register'
      },
      registerStep: 'swirl-step-two',
      stepPK: undefined,
      showingCard: true,
      dhoname: undefined
    }
  },
  mounted () {
    if (this.$router.currentRoute.params) {
      this.dhoname = this.$router.currentRoute.params.dhoname
    }
  },
  computed: {
    ...mapGetters('dao', ['selectedDao', 'daoSettings']),
    animationSwirl () {
      switch (this.step) {
        case 'welcome':
          return 'swirl-step-one'
        case 'login':
          return 'swirl-step-two'
        case 'register':
          // ('animationSwirl')
          if (this.registerStep === 'phoneNumber') {
            return 'swirl-step-two'
          } else if (this.registerStep === 'keys') {
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
          if (this.registerStep === 'phoneNumber') {
            return 'swirl-step-two-mobile'
          } else if (this.registerStep === 'keys') {
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
          if (this.registerStep === 'phoneNumber') {
            return 'welcome-bg-step-two'
          } else if (this.registerStep === 'keys') {
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
          if (this.registerStep === 'phoneNumber') {
            return 'welcome-bg-step-two-mobile'
          } else if (this.registerStep === 'keys') {
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
    }
  }
}
</script>

<template lang="pug">
.fullscreen
    .relative-position.full-height.full-widthrt(v-if="$q.platform.is.desktop")
        .welcome-bg.full-height.full-width(:class="animationBG")
        .welcome-fg.full-height.full-width
        .swirl(:class="animationSwirl")
        .row.full-height.card-container
            .col-xl-4.col-sm-6.col-xs-12(v-if="showingCard").left-container
                q-card.custom-full-height.card-container.left-card
                    header-view( :step="step" :steps="steps" @logoClick="step = steps.welcome" :logo="selectedDao.logo" :daoName="selectedDao.title")
                    transition(v-if="step === steps.welcome" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
                      welcome-view.full-width(@onLoginClick="step = steps.login" @onRegisterClick="step = steps.register")
                    transition(v-else-if="step === steps.login" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
                      login-view(:dhoName="dhoname" :pk="stepPK" @onLoginWithPK=" v => stepPK = true")
                    transition(v-else-if="step === steps.register" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
                      register-user-view(@stepChanged="v => registerStep = v" @onFinish="step = steps.login")
                    bottom-section.index.custom-full-height(:daoSettings="daoSettings" v-if="step === steps.login || step === steps.register && registerStep !== 'finish'" :stepPK="stepPK" :step="step" :steps="steps" @onClickRegisterHere="step = steps.register; stepPK = false" @onClickLogin="stepPK = false" @onClickLoginPage="step = steps.login; stepPK = false")
            .col.full-height.card-container.relative-position.gt-xs
                .welcome-info.absolute-center
                    //- .hypha-logo
                    ipfs-image-viewer(
                      :ipfsCid="selectedDao.logo"
                      showDefault
                      :defaultLabel="daoName"
                      size="300px"
                    )
    .relative-position.full-height.full-width.custom-scroll-area(v-if="$q.platform.is.mobile")
      .welcome-bg-mobile.full-height.full-width(:class="animationBGMobile")
      .welcome-fg.full-height.full-width
      .swirl-mobile(:class="animationSwirlMobile")
      img.hyphaLogo(src="~assets/logos/hypha-logo-full.svg")
      q-card.card-container.bottom-card(:class="animationCardMobile")
        transition(v-if="step === steps.welcome" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          welcome-view.full-width(@onLoginClick="step = steps.login" @onRegisterClick="step = steps.register")
        transition(v-else-if="step === steps.login" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          login-view(:dhoName="dhoname" :pk="stepPK" @onLoginWithPK=" v => stepPK = true")
        transition(v-else-if="step === steps.register" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
          register-user-view(@stepChanged="v => registerStep = v" @onFinish="step = steps.login" @onClickLoginPage="step = steps.login")
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
.swirl
    background: transparent url('../../assets/images/swirl.png')
    background-repeat: no-repeat
    background-size: contain
    position: absolute
    // background-color: $secondary
    z-index: 3
    width: 70%
    height: 150%
    transform: matrix(-1, 0, 0, -1, 0, 0) rotate(180deg) translateX(82%);
    transition: all 1s
    transition-timing-function: ease-out
    margin-top: -20%
.swirl-step-one
  margin-top: -20%
  transform: matrix(-1, 0, 0, -1, 0, 0) rotate(180deg) translateX(95%);
.swirl-step-two
  margin-top: -38%
  transform: matrix(-0.99, -0.14, 0.14, -0.99, 0, 0) rotate(188deg) translateX(88%);
.swirl-step-three
  margin-top: -80%
  transform: matrix(-0.87, -0.48, 0.48, -0.87, 0, 0) rotate(195deg) translateX(100%);
.swirl-step-four
  margin-top: -135%
  transform: matrix(-0.68, -0.73, 0.73, -0.68, 0, 0) rotate(199deg) translateX(150%);
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
  position: absolute
  top: 220px
  left: 0
  right: 0
  bottom: 0
  border-radius: 55px 55px 0 0
  padding: 54px 45px 30px
  @media (orientation: landscape)
    height: fit-content !important
  @media (orientation: landscape) and (min-width: 1024px)
    height: auto !important
  @media (max-width: 375px) and (max-height: 667px)
    height: 100% !important
    max-height: calc(100vh - 130px)
.bottom-card-step-two
  top: 130px
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
.swirl-mobile
  background: transparent url('../../assets/images/swirl.png')
  background-repeat: no-repeat
  background-size: contain
  position: absolute
  // background-color: $secondary
  z-index: 3
  width: 300%
  height: 150%
  transform: matrix(-1, 0, 0, -1, 0, 0) rotate(180deg) translateX(82%);
  transition: all 1s
  transition-timing-function: ease-out
  margin-top: -85%
.swirl-step-one-mobile
  margin-top: -85%
  transform: matrix(-1, 0, 0, -1, 0, 0) rotate(180deg) translateX(-40%);
.swirl-step-two-mobile
  margin-top: -115%
  transform: matrix(-0.99, -0.14, 0.14, -0.99, 0, 0) rotate(160deg) translateX(-40%);
.swirl-step-three-mobile
  margin-top: -115%
  transform: matrix(-0.99, -0.14, 0.14, -0.99, 0, 0) rotate(160deg) translateX(-42%);
.swirl-step-four-mobile
  margin-top: -115%
  transform: matrix(-0.99, -0.14, 0.14, -0.99, 0, 0) rotate(165deg) translateX(-43%);
.hyphaLogo
  width: 150px
  margin: 44px 0 0 42px
  z-index: 10
  position: relative
.custom-scroll-area
  @media (orientation: landscape)
    overflow-y: auto
    overflow-x: hidden
  @media (max-width: 375px) and (max-height: 667px)
    overflow-y: auto
    overflow-x: hidden
</style>

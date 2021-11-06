<script>
export default {
  name: 'Login',
  components: {
    WelcomeView: () => import('~/components/login/welcome-view.vue'),
    HeaderView: () => import('~/components/login/header-view.vue'),
    LoginView: () => import('~/components/login/login-view.vue'),
    RegisterUserView: () => import('~/components/login/register-user-view.vue')
  },
  data () {
    return {
      step: 'welcome',
      steps: {
        welcome: 'welcome',
        login: 'login',
        register: 'register'
      }
    }
  }
}
</script>

<template lang="pug">
.fullscreen
    .relative-position.full-height.full-width
        .welcome-bg.full-height.full-width
        .welcome-fg.full-height.full-width
        .swirl
        .row.full-height.card-container
            .col-3
                q-card.full-height.card-container.q-pa-xl
                    header-view(@onClickRegisterHere="step = steps.welcome" :step="step" :steps="steps")
                    welcome-view(v-if="step === steps.welcome" @onLoginClick="step = steps.login" @onRegisterClick="step = steps.register")
                    login-view(v-else-if="step === steps.login")
                    register-user-view(v-else-if="step === steps.register")
            .col.full-height.card-container.relative-position
                .welcome-info.absolute-center
                    .hypha-logo
</template>

<style lang="stylus" scoped>
.welcome-bg
  background-image: url('../../assets/images/loginBg.png')
  background-repeat: no-repeat
  background-size: cover
  position: absolute
.welcome-fg
    background: $primary
    position: absolute
    z-index: 2
    opacity: 0.85
.swirl
    background: transparent url('../../assets/images/swirl.png') 0% 0% no-repeat padding-box
    background-repeat: no-repeat
    background-size: contain
    position: absolute
    // background-color: $secondary
    z-index: 3
    width: 1400px
    height: 1400px
    transform: matrix(-0.68, -0.73, 0.73, -0.68, 0, 0) rotate(180deg) translateX(38%);
    margin-top: -70%
    margin-right: -30%
    transition: rotate 2s;
.card-container
    z-index: 5
.hypha-logo
    background-image: url('../../assets/logos/hypha-logo-blue.svg')
    width: 500px
    height: 200px
    background-repeat: no-repeat
    background-size: contain
</style>

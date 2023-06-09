<template>
  <VueReCaptcha :sitekey="this.sitekey" :loadRecaptchaScript="true" @verify="verifyChallenge" />
</template>

<script>
import VueReCaptcha from 'vue-recaptcha'
import CaptchaService from '../../services/captcha'

export default {
  name: 'captcha',
  components: { VueReCaptcha },
  data() {
    const sitekey = process.env.CAPTCHA_PUBLIC_KEY
    return {
      sitekey
    }
  },
  methods: {
    verifyChallenge(response) {
      CaptchaService.verifyChallenge({ token: response, network: process.env.CAPTCHA_NETWORK }).then((response) => {
        this.$emit('setCaptchaResponse', response)
      })
    }
  }
}
</script>

<style></style>

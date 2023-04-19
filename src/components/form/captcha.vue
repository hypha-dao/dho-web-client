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
      console.log('RESPONSE: ', response)
      CaptchaService.verifyChallenge({ token: response, network: 'telosTestnet' }).then((response) => {
        console.log('RESPONSE: ', response)
        this.$emit('setCaptchaResponse', response)
      }).catch(error => console.log(error))
    }
  }
}
</script>

<style></style>

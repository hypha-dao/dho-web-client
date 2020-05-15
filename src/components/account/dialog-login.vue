<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'dialog-login',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        account: null,
        privateKey: null
      },
      errorPrivateKey: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['loading'])
  },
  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp', 'autoLogin']),
    async onLoginWallet (idx) {
      await this.loginWallet({ idx, returnUrl: this.$route.query.returnUrl })
    },
    async onLoginInApp () {
      this.errorPrivateKey = null
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      this.errorPrivateKey = await this.loginInApp({
        ...this.form,
        returnUrl: this.$route.query.returnUrl
      })
      this.submitting = false
    },
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  @before-hide="$emit('update:show', false)"
)
  q-card.login-card(
    :style="{ width: $q.platform.is.desktop ? '400px' : '100%' }"
  )
    q-card-section.text-center
      .text-h6 Login
    q-card-section
      q-input(
        ref="account"
        v-model="form.account"
        label="Account"
        maxlength="12"
        :rules="[rules.required, rules.accountFormat]"
        lazy-rules
      )
      q-input(
        ref="privateKey"
        v-model="form.privateKey"
        label="Private key"
        :rules="[rules.required]"
        lazy-rules
        :error="!!errorPrivateKey"
        :error-message="errorPrivateKey"
      )
    q-card-actions
      q-btn.full-width(
        color="primary"
        label="Login"
        @click="onLoginInApp"
        :loading="submitting"
      )
    q-card-section
      .or-sep.flex.justify-between.text-accent
        hr.separator(:style="{ width: $q.platform.is.desktop ? '45%' : '35%' }")
        | OR
        hr.separator(:style="{ width: $q.platform.is.desktop ? '45%' : '35%' }")
    q-card-section
      q-list
        q-item.wallet(
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
              width="30"
            )
          q-item-section.cursor-pointer(@click="onLoginWallet(idx)") {{ wallet.getStyle().text }}
          q-item-section(avatar)
            .flex
              q-spinner(
                v-if="loading === wallet.getStyle().text"
                :color="wallet.getStyle().textColor"
                size="2em"
              )
              q-btn(
                v-else
                :color="wallet.getStyle().textColor"
                icon="fas fa-download"
                @click="openUrl(wallet.getOnboardingLink())"
                target="_blank"
                dense
                flat
                size="12px"
              )
                q-tooltip Get app
</template>

<style lang="stylus" scoped>
.or-sep
  width 100%
</style>

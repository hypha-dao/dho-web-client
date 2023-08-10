<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'
export default {
  name: 'login-view',
  mixins: [validation],
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  props: {
    dhoName: String,
    isOnboarding: {
      type: Boolean,
      default: false
    },
    pk: Boolean
  },

  data () {
    return {
      pkForm: false,
      form: {
        account: null,
        privateKey: null
      },
      errorPrivateKey: null,
      submitting: false,
      selectedAuthenticator: null
    }
  },

  mounted() {
    this.selectedAuthenticator = this.authenticators[2]
  },

  computed: {
    ...mapGetters('accounts', ['loading']),
    ...mapGetters('dao', ['daoSettings', 'selectedDao']),
    authenticators () {
      return this.$ual.authenticators.map((wallet, idx) => {
        return {
          label: wallet.ualName[0].toUpperCase() + wallet.ualName.slice(1) + ' Wallet',
          icon: wallet.getStyle().icon,
          idx: idx
        }
      })
    }
  },

  methods: {
    ...mapActions('accounts', ['loginWallet', 'loginInApp']),
    async onLoginWallet (idx) {
      if (this.$router.currentRoute.name === 'create-your-dao') {
        await this.loginWallet({ idx, returnUrl: 'create-your-dao' })
        this.$emit('transitionToRegister')
      } else {
        await this.loginWallet({ idx, returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home' })
      }
    },
    async onLoginInApp () {
      this.errorPrivateKey = null
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      this.errorPrivateKey = await this.loginInApp({
        ...this.form,
        returnUrl: this.isOnboarding ? 'create' : this.$route.query.returnUrl || 'home'
      })
      this.submitting = false
    },
    openUrl (url) {
      window.open(url)
    }
    // onLoginWithPK () {
    //   this.pkForm = true
    //   this.$emit('onLoginWithPK')
    // }
  }
}
</script>

<template lang="pug">
.full-width.full-height.flex(:class="{ 'items-start':!$q.screen.gt.md, 'items-center':$q.screen.gt.md }")
  .full-width.full-height.flex.column.justify-between.no-wrap(:style="{ 'padding-bottom': '140px' }")
    .full-height.flex.justify-center.column
      .row.flex.items-center.cursor-pointer(@click="$emit('back')")
        q-icon.q-mr-xxs(name="fas fa-arrow-left" color="primary" size="14px")
        .text-bold.text-primary {{ $t('login.login-view.back') }}
      template(v-if="$q.screen.gt.md")
        .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ $t('login.login-view.loginTo', { daoName: selectedDao?.title?.replace(/^\w/, (c) => c.toUpperCase()) }) }}
      template(v-if="!$q.screen.gt.md")
        span
          .font-lato.text-heading.text-weight-bolder(:style="{ 'font-size': '34px' }") {{ $t('login.login-view.loginTo1') }}
            .text-weight-bolder {{ $t('login.login-view.yourAccount') }}
      .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg(v-if="$q.screen.gt.md") {{ $t('login.login-view.youCanEither') }}
      .h-b1-signup.text-weight-thin.q-mt-lg.q-mb-lg(v-if="!$q.screen.gt.md") {{ $t('login.login-view.pleaseLoginWith') }}
    div
      .col-12(v-if="pkForm && pk")
        .text-h5.text-bold.input-label.q-mb-md {{ $t('login.login-view.account1') }}
        q-input(ref="account" v-model="form.account" :placeholder="$t('login.login-view.account2')" maxlength="12" :rules="[rules.required, rules.accountFormat]" lazy-rules rounded dense outlined bg-color="white")
        .text-h5.text-bold.input-label.q-mb-md {{ $t('login.login-view.privateKey') }}
        q-input(ref="privateKey" v-model="form.privateKey" type="password" :placeholder="$t('login.login-view.privateKey1')" :rules="[rules.required]" lazy-rules :error="!!errorPrivateKey" :error-message="errorPrivateKey" rounded dense outlined bg-color="white")
        .row.justify-end
          q-btn.q-mt-md.login-button(unelevated :label="$t('login.login-view.login')" no-caps @click="onLoginInApp" :loading="submitting")
      .col-xs-12.col-md-6.q-mt-xxxl(v-else)
        q-list(v-if="$ual" v-for="(wallet, idx) in $ual.authenticators" :key="wallet.getStyle().text")
          q-item.wallet.q-my-xs(v-if="wallet.ualName !== 'seeds'" v-ripple :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }")
            q-item-section.cursor-pointer(avatar @click="onLoginWallet(idx)")
              img(:src="wallet.getStyle().icon" width="20")
            q-item-section.cursor-pointer.text-center(@click="onLoginWallet(idx)") {{ $t('login.login-view.login1', { '1': wallet.getStyle().text, '2': wallet.getStyle().text === 'Seeds' ? '(beta)' : '' }) }}
            q-item-section(avatar)
              .flex
                loading-spinner(v-if="loading === wallet.getStyle().text" :color="wallet.getStyle().textColor" size="2em")
                q-btn(v-else :color="wallet.getStyle().textColor" icon="fas fa-cloud-download-alt" @click="openUrl(wallet.getOnboardingLink())" target="_blank" dense flat size="10px")
                  q-tooltip {{ $t('login.login-view.getApp') }}
        .row.full-width.flex.justify-center.q-mt-md.q-mb-xs
          .h-b1-signup {{ $t('login.login-view.orChooseAPartner') }}
        .row.flex.items-center
          .col.q-mr-md
            q-select.q-mt-xs(:options="authenticators" dense dropdown-icon="fas fa-chevron-down" hide-bottom-space options-dense outlined rounded v-model="selectedAuthenticator")
              template(v-if="selectedAuthenticator" v-slot:prepend)
                img(:src="selectedAuthenticator?.icon" width="20" height="20")
              template(v-slot:option="scope")
                q-item.q-pa-xs(v-if="!scope.opt.group && scope.opt.label === 'Seeds Wallet'"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                )
                  .row
                    img(:src="scope.opt.icon" width="20" height="20")
                    .q-ml-md {{ scope.opt.label }}
          .col-2
            q-btn.q-mt-xs.full-width(:disable="!selectedAuthenticator" :style="{ 'height': 'fit-content' }" :label="'Log in'" color="primary" @click="onLoginWallet(selectedAuthenticator.idx)" unelevated rounded no-caps outline)
</template>

<style lang="stylus" scoped>
.wallet
  min-height 40px !important
  border-radius 15px
  font-weight 600
.login-button
  background: #242F5D
  color:white
  font-weight: 600
  border-radius: 25px
  width: 152px
  height: 40px
</style>

<script>
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { mapActions, mapGetters, mapMutations } from 'vuex'

const defaultDesc = 'The main information of the payout. Please be concise and precise! Explain what the payout consist of.'

export default {
  name: 'payout-form',
  mixins: [forms, validation],
  data () {
    return {
      form: {
        title: null,
        description: defaultDesc,
        recipient: null,
        hyphaAmount: '0.00',
        seedsAmount: '0.0000',
        hvoiceAmount: '0.00',
        contributedAt: null,
        instantPay: false
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  mounted () {
    this.form.recipient = this.account
  },
  methods: {
    ...mapActions('payouts', ['saveProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    async onSaveProposal () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.saveProposal(this.form)
      if (success) {
        await this.reset()
        this.hideForm()
        await this.$router.push({ path: '/proposals/payout' })
      }
      this.submitting = false
    },
    async reset () {
      this.form = {
        title: null,
        description: defaultDesc,
        recipient: null,
        hyphaAmount: '0.00',
        seedsAmount: '0.0000',
        hvoiceAmount: '0.00',
        contributedAt: null,
        instantPay: false
      }
      await this.resetValidation(this.form)
    },
    hideForm () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  q-input(
    ref="title"
    v-model="form.title"
    color="accent"
    label="Title"
    maxlength="100"
    :rules="[rules.required]"
    lazy-rules
    outlined
    dense
  )
  q-editor(
    v-model="form.description"
    :fullscreen.sync="isFullScreen"
    min-height="100px"
    :toolbar="isFullScreen ? fullScreenToolbar : defaultToolbar"
  )
  fieldset.q-mt-sm
    legend Payout amounts
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        q-input(
          ref="hyphaAmount"
          v-model="form.hyphaAmount"
          label="Hypha"
          type="number"
          color="accent"
          suffix="HYPHA"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.hyphaAmount = parseFloat(form.hyphaAmount).toFixed(2)"
        )
      .col-xs-12.col-md-6
        q-input(
          ref="seedsAmount"
          v-model="form.seedsAmount"
          label="Seeds"
          type="number"
          color="accent"
          suffix="SEEDS"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.seedsAmount = parseFloat(form.seedsAmount).toFixed(4)"
        )
    .row.q-col-gutter-sm
      .col-xs-12.col-md-6
        q-input(
          ref="hvoiceAmount"
          v-model="form.hvoiceAmount"
          label="Hypha Voice"
          type="number"
          color="accent"
          suffix="VOICE"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
          outlined
          dense
          @blur="form.hvoiceAmount = parseFloat(form.hvoiceAmount).toFixed(2)"
        )
  fieldset.q-mt-sm
    legend Additional information
    q-checkbox(
      v-model="form.instantPay"
      label="Instant pay"
    )
    q-input(
      ref="contributedAt"
      label="Contributed at"
      v-model="form.contributedAt"
      :rules="[rules.required]"
      lazy-rules
    )
      template(v-slot:append)
        q-icon.cursor-pointer(name="event")
          q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
            q-date(v-model="form.contributedAt" @input="() => $refs.qDateProxy.hide()")
  .text-center.q-mt-sm
    q-btn.q-mr-sm(
      label="Cancel"
      rounded
      color="grey"
      dense
      unelevated
      @click="hideForm"
    )
    q-btn(
      label="Create"
      rounded
      color="hire"
      dense
      unelevated
      :loading="submitting"
      @click="onSaveProposal"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
button
  width 30%
</style>

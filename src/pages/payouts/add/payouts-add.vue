<script>
import { validation } from '~/mixins/validation'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'page-payouts-add',
  mixins: [validation],
  data () {
    return {
      step: 'main',
      stepIndex: {
        main: 1,
        details: 2,
        payout: 3
      },
      mainForm: {
        title: null,
        description: null
      },
      detailsForm: {
        content: ''
      },
      payoutForm: {
        recipient: null,
        hyphaAmount: null,
        seedsAmount: null,
        hvoiceAmount: null,
        contributedAt: null
      },
      splitter: 50,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account'])
  },
  mounted () {
    this.payoutForm.recipient = this.account
  },
  methods: {
    ...mapActions('payouts', ['saveProposal']),
    async next () {
      const form = this[`${this.step}Form`]
      await this.resetValidation(form)
      if (!(await this.validate(form))) return

      if (this.step === 'payout') {
        await this.onSaveProposal()
      } else {
        this.$refs.stepper.next()
      }
    },
    async onSaveProposal () {
      this.submitting = true
      const success = await this.saveProposal({
        ...this.mainForm,
        ...this.detailsForm,
        ...this.payoutForm
      })
      if (success) {
        await this.$router.push({ path: '/proposals' })
      }
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  q-card.new-payout-form
    q-card-section.text-center.bg-proposal.text-white
      .text-h6 Propose a new payout
    q-stepper(
      ref="stepper"
      v-model="step"
      horizontal
      color="primary"
      animated
      :contracted="$q.screen.lt.sm"
    )
      q-step(
        name="main"
        title="Presentation"
        :done="stepIndex[step] > 1"
      )
        | The main information of the payout. Please be concise and precise! Explain what the payout consist of.
        q-input(
          ref="title"
          v-model="mainForm.title"
          color="accent"
          label="Title"
          maxlength="100"
          :rules="[rules.required]"
          lazy-rules
        )
        q-input(
          ref="description"
          v-model="mainForm.description"
          type="textarea"
          color="accent"
          label="Description"
          maxlength="250"
          hint="A brief presentation of max 250 characters"
          counter
          :rules="[rules.required]"
          lazy-rules
        )
      q-step(
        name="details"
        title="Details"
        :done="stepIndex[step] > 2"
      )
        .row.flex.justify-between
          | Write the details of payout you would like to submit. You can be creative here.
          a.md-hint(
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
          ) Markdown Cheat Sheet
        q-splitter(
          v-model="splitter"
          style="height: 500px;"
        )
          template(v-slot:separator)
            q-avatar(color="primary" text-color="white" size="28px" icon="fas fa-arrows-alt-h")
          template(v-slot:before)
            .q-pa-md
              q-input.fit.q-pa-sm(
                ref="content"
                v-model="detailsForm.content"
                type="textarea"
                rows="20"
                maxlength="3500"
                :rules="[rules.required]"
                lazy-rules
              )
          template(v-slot:after)
            .q-pa-md
              q-markdown.fit.q-pa-sm(:src="detailsForm.content")
      q-step(
        name="payout"
        title="Information"
        :done="stepIndex[step] > 3"
      )
        | This is where you define the payout information.
        q-input(
          ref="recipient"
          v-model="payoutForm.recipient"
          label="Recipient"
          maxlength="12"
          :rules="[rules.required, rules.accountFormat, rules.accountExists]"
          lazy-rules
        )
        q-input(
          ref="hyphaAmount"
          v-model="payoutForm.hyphaAmount"
          label="Hypha salary"
          type="number"
          suffix="HYPHA"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
        )
        q-input(
          ref="seedsAmount"
          v-model="payoutForm.seedsAmount"
          label="Seeds"
          type="number"
          suffix="SEEDS"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
        )
        q-input(
          ref="hvoiceAmount"
          v-model="payoutForm.hvoiceAmount"
          label="Hypha Voice"
          type="number"
          suffix="VOICE"
          :rules="[rules.required, rules.positiveAmount]"
          lazy-rules
        )
        q-input(
          ref="contributedAt"
          label="Contributed at"
          v-model="payoutForm.contributedAt"
          :rules="[rules.required]"
          lazy-rules
        )
          template(v-slot:append)
            q-icon.cursor-pointer(name="event")
              q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
                q-date(v-model="payoutForm.contributedAt" @input="() => $refs.qDateProxy.hide()")
      template(v-slot:navigation)
        q-stepper-navigation
          .row.flex.justify-between
            q-btn(
              label="Cancel"
              color="secondary"
              flat
              @click="$router.go(-1)"
            )
            div
              q-btn(
                v-if="stepIndex[step] > 1"
                label="Back"
                flat
                @click="$refs.stepper.previous()"
              )
              q-btn(
                :label="step === 'payout' ? 'Save' : 'Next'"
                color="primary"
                @click="next"
                :loading="submitting"
              )
</template>

<style lang="stylus" scoped>
.new-payout-form
  margin 0 auto
  width 100%
  max-width 1200px
  height 100%
.md-hint
  text-decoration none
  color $primary
</style>

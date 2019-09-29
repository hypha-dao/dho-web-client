<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'role-form',
  mixins: [validation],
  data () {
    return {
      form: {
        title: null,
        url: null,
        description: null,
        startPeriod: null,
        endPeriod: null,
        hyphaSalary: 0,
        preseedsSalary: 0,
        voiceSalary: 0
      },
      rules: {
        periodBefore: () => {
          if (!this.form.startPeriod || !this.form.endPeriod) {
            return true
          }
          return new Date(this.form.startPeriod.startDate).getTime() < new Date(this.form.endPeriod.startDate).getTime() || 'The start period must be before the end period'
        }
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods', 'periodOptions'])
  },
  methods: {
    ...mapActions('roles', ['submitProposal']),
    async onSubmitProposal () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.submitProposal(this.form)
      this.submitting = false
      if (result) {
        this.$router.push({ path: '/roles/proposals' })
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg.row
  q-card.col-xs-8.offset-xs-2
    q-card-section
      .text-h5 Propose a role
    q-card-section
      .text-h6 Information
      q-input(
        ref="title"
        v-model="form.title"
        label="Title*"
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        ref="url"
        v-model="form.url"
        label="URL"
        :rules="[rules.url]"
        lazy-rules
      )
      q-input.form-proposal-description(
        ref="description"
        v-model="form.description"
        type="textarea"
        label="Description*"
        hint="You can use markdown"
        :rules="[rules.required]"
        lazy-rules
      )
    q-separator
    q-card-section
      .text-h6 Period
      .row
        .col-md-6.col-xs-12
          q-select(
            ref="startPeriod"
            v-model="form.startPeriod"
            label="Start*"
            :options="periodOptions"
            :rules="[rules.required, rules.periodBefore]"
            lazy-rules
          )
        .col-md-6.col-xs-12
          q-select(
            ref="endPeriod"
            v-model="form.endPeriod"
            label="End*"
            :options="periodOptions"
            :rules="[rules.required, rules.periodBefore]"
            lazy-rules
          )
    q-separator
    q-card-section.q-mb-lg
      .text-h6 Salary
      q-input(
        ref="hyphaSalary"
        v-model="form.hyphaSalary"
        label="Hypha salary"
        type="number"
        suffix="HYPHA"
        :rules="[rules.positiveAmount]"
        lazy-rules
      )
      q-input(
        ref="preseedSalary"
        v-model="form.preseedsSalary"
        label="Pre-seeds salary"
        type="number"
        suffix="PRE-SEEDS"
        :rules="[rules.positiveAmount]"
        lazy-rules
      )
      q-input(
        ref="voiceSalary"
        v-model="form.voiceSalary"
        label="Voice salary"
        type="number"
        suffix="VOICE"
        :rules="[rules.positiveAmount]"
        lazy-rules
      )
    q-separator
    q-card-actions.q-pa-xs.bg-white.flex.justify-end
      q-btn(
        color="primary"
        label="Cancel"
        flat
        @click="$emit('close')"
      )
      q-btn(
        color="primary"
        label="Save"
        :loading="submitting"
        @click="onSubmitProposal"
      )
</template>

<style lang="stylus">
.form-proposal-description
  textarea
    min-height 350px !important
</style>

<script>
import { validation } from '~/mixins/validation'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'page-roles-add',
  mixins: [validation],
  data () {
    return {
      rules: {
        periodBefore: () => {
          if (!this.assignmentForm.startPeriod || !this.assignmentForm.endPeriod) {
            return true
          }
          return new Date(this.assignmentForm.startPeriod.startDate).getTime() < new Date(this.assignmentForm.endPeriod.startDate).getTime() || 'The start period must be before the end period'
        }
      },
      step: 'main',
      stepIndex: {
        main: 1,
        details: 2,
        assignment: 3
      },
      mainForm: {
        title: null,
        description: null
      },
      detailsForm: {
        content: ''
      },
      assignmentForm: {
        recipient: null,
        role: null,
        startPeriod: null,
        endPeriod: null,
        timeShare: null
      },
      splitter: 50,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('roles', ['rolesOptions']),
    ...mapGetters('periods', ['periodOptionsStart', 'periodOptionsEnd'])
  },
  async mounted () {
    await this.fetchData()
  },
  methods: {
    ...mapActions('assignments', ['saveProposal']),
    ...mapActions('roles', ['fetchData']),
    async next () {
      const form = this[`${this.step}Form`]
      await this.resetValidation(form)
      if (!(await this.validate(form))) return

      if (this.step === 'assignment') {
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
        ...this.assignmentForm
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
  q-card.new-assignment-form
    q-card-section.text-center.bg-proposal.text-white
      .text-h6 Propose a new assignment for a role
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
        | The main information of the assignment. Please be concise and precise! Explain what the assignment consist of.
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
          | Write the details of assignment you would like to submit. You can be creative here.
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
        name="assignment"
        title="Information"
        :done="stepIndex[step] > 3"
      )
        | This is where you define the assignment's role
        q-input(
          ref="recipient"
          v-model="assignmentForm.recipient"
          label="Recipient"
          maxlength="12"
          :rules="[rules.required, rules.accountFormat, rules.accountExists]"
          lazy-rules
        )
        q-select(
          ref="role"
          v-model="assignmentForm.role"
          label="Role"
          :options="rolesOptions"
          :rules="[rules.required, rules.periodBefore]"
          lazy-rules
        )
        q-input(
          ref="timeShare"
          v-model="assignmentForm.timeShare"
          label="Time share"
          type="number"
          suffix="%"
          :rules="[rules.required, rules.positiveAmount, rules.lessOrEqualThan(100)]"
          lazy-rules
        )
        .row
          .col-md-6.col-xs-12
            q-select(
              ref="startPeriod"
              v-model="assignmentForm.startPeriod"
              label="Start"
              :options="periodOptionsStart"
              :rules="[rules.required, rules.periodBefore]"
              lazy-rules
            )
          .col-md-6.col-xs-12
            q-select(
              ref="endPeriod"
              v-model="assignmentForm.endPeriod"
              label="End"
              :options="periodOptionsEnd"
              :rules="[rules.required, rules.periodBefore]"
              lazy-rules
            )
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
                :label="step === 'assignment' ? 'Save' : 'Next'"
                color="primary"
                @click="next"
                :loading="submitting"
              )
</template>

<style lang="stylus" scoped>
.new-assignment-form
  margin 0 auto
  width 100%
  max-width 1200px
  height 100%
.md-hint
  text-decoration none
  color $primary
</style>

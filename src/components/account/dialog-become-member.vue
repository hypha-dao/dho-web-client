<script>
import { validation } from '~/mixins/validation'
import { mapActions } from 'vuex'

export default {
  name: 'dialog-become-member',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        reason: null
      },
      submitting: false
    }
  },
  methods: {
    ...mapActions('members', ['apply', 'fetchApplication']),
    onCloseDialog () {
      this.form.reason = null
      this.$emit('update:show', false)
    },
    async onSubmit () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.apply(this.form.reason)
      this.submitting = false
      if (result) {
        if (this.$route.path !== '/members/add/success') {
          await this.$router.push({ path: '/members/add/success' })
        }
      }
    }
  },
  watch: {
    show: {
      immediate: true,
      async handler () {
        const application = await this.fetchApplication()
        if (application) {
          this.modify = true
          this.form.reason = application.content
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  @before-hide="$emit('update:show', false)"
)
  q-card.member-card
    q-card-section.text-center
      .text-h6 Become a member
    q-card-section
      q-input(
        ref="reason"
        v-model="form.reason"
        label="Reason for membership"
        maxlength="140"
        counter
        :rules="[rules.required]"
        lazy-rules
      )
    q-card-actions
      q-btn(
        label="Cancel"
        flat
        @click="onCloseDialog"
      )
      q-btn(
        label="Send"
        color="secondary"
        @click="onSubmit"
        :loading="submitting"
      )
</template>

<style lang="stylus" scoped>
.member-card
  min-width 600px
</style>

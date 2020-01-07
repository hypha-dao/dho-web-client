<script>
import { validation } from '~/mixins/validation'
import { mapActions } from 'vuex'

export default {
  name: 'page-members-apply',
  mixins: [validation],
  data () {
    return {
      form: {
        content: ''
      },
      modify: false,
      splitter: 50,
      submitting: false
    }
  },
  async mounted () {
    const application = await this.fetchApplication()
    if (application) {
      this.modify = true
      this.form.content = application.content
    }
  },
  methods: {
    ...mapActions('members', ['apply', 'fetchApplication']),
    async onApply () {
      await this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const result = await this.apply(this.form.content)
      this.submitting = false
      if (result) {
        await this.$router.push({ path: '/members/add/success' })
      }
    }
  }
}
</script>

<template lang="pug">
q-page.q-pa-lg
  q-card
    q-card-section
      .row.flex.justify-between
        | What would you like to bring to the Hypha DAO?
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
              v-model="form.content"
              type="textarea"
              rows="20"
              :rules="[rules.required]"
              lazy-rules
            )
        template(v-slot:after)
          .q-pa-md
            q-markdown.fit.q-pa-sm(:src="form.content")
    q-card-actions(align="right")
      q-btn(
        :label="`${modify ? 'Modify my application' : 'Submit my application'}`"
        color="primary"
        @click="onApply"
        :loading="submitting"
      )
</template>

<style lang="stylus" scoped>

</style>

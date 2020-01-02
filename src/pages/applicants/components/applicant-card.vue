<script>
import { format } from '~/mixins/format'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'applicant-card',
  mixins: [format],
  props: {
    applicant: { type: Object, required: true }
  },
  data () {
    return {
      content: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isEnroller'])
  },
  methods: {
    ...mapActions('applicants', ['enroll']),
    async onEnroll () {
      this.submitting = true
      await this.enroll({
        applicant: this.applicant.applicant,
        content: this.content
      })
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-card
  q-card-section.text-center.bg-accent.text-white
      .text-h6 {{ applicant.applicant }}
  q-card-section.description.q-mt-md
    q-markdown.fit.q-pa-sm(:src="applicant.content")
  q-card-section.text-right
    i {{ new Date(applicant.updated_date).toDateString()}}
  q-separator(v-if="isEnroller")
  q-card-actions(v-if="isEnroller")
    q-input.full-width(
      v-model="content"
      label="Note"
      maxlength="200"
      outlined
    )
    q-btn.full-width.q-mt-xs(
      color="primary"
      label="Enroll"
      @click="onEnroll"
      :loading="submitting"
    )
</template>

<style lang="stylus" scoped>
.description
  white-space pre-wrap
</style>

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
      submitting: false,
      details: false
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
q-card.applicant
  q-card-section.text-center.q-pb-sm
    q-avatar.avatar(
      size="150px"
      color="accent"
      text-color="white"
    )
      | {{ applicant.applicant.slice(0, 2).toUpperCase() }}
  q-card-section.cursor-pointer(@click="details = !details")
    .name {{ applicant.applicant }}
  q-card-section.note(v-show="details")
    p {{ applicant.content | truncate(140) }}
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
.applicant
  width 250px
  border-radius 1rem
  margin 10px
  .avatar
    border-radius 50% !important
    width 150px
  .name
    font-size 24px
  .note
    white-space pre-wrap
    max-height 55px
    overflow auto
</style>

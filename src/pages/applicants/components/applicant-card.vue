<script>
import { mapActions, mapGetters } from 'vuex'
import { format } from '~/mixins/format'
import { documents } from '~/mixins/documents'

export default {
  name: 'applicant-card',
  mixins: [documents, format],
  props: {
    applicant: { type: Object, required: true }
  },
  data () {
    return {
      profile: null,
      content: null,
      submitting: false,
      details: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['isEnroller']),
    name () {
      return this.getValue(this.applicant, 'details', 'member')
    },
    note () {
      return this.getValue(this.applicant, 'details', 'note')
    }
  },
  methods: {
    ...mapActions('applicants', ['enroll']),
    ...mapActions('profiles', ['getPublicProfile']),
    async onEnroll () {
      this.submitting = true
      await this.enroll({
        applicant: this.name,
        content: this.content
      })
      this.submitting = false
    }
  },
  watch: {
    name: {
      immediate: true,
      async handler (val) {
        this.profile = await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.applicant
  q-card-section.text-center.q-pb-sm
    q-img.avatar(
      v-if="profile && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${name}`})"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${name}`})"
    )
      | {{ name.slice(0, 2).toUpperCase() }}
  q-card-section.cursor-pointer(@click="details = !details")
    .name {{ name }}
  q-card-section.note(v-if="note" v-show="details")
    p {{ note | truncate(140) }}
  q-card-section.text-right
    i {{ new Date(applicant.created_date).toDateString()}}
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

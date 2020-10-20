<script>
import { mapActions, mapMutations } from 'vuex'
import { Notify } from 'quasar'
import { format } from '~/mixins/format'
import Avatar from './parts/avatar'
import CardTitle from './parts/card-title'
import DraftMenu from './parts/draft-menu'
import TopRightIcon from './parts/top-right-icon'

export default {
  name: 'draft-proposal-card',
  mixins: [format],
  props: {
    draft: { type: Object, required: true },
    type: { type: String, required: true }
  },
  components: { Avatar, CardTitle, DraftMenu, TopRightIcon },
  data () {
    return {
      submitting: false
    }
  },
  computed: {
    title () {
      if (this.draft.role) {
        const data = this.draft.role.strings.find(s => s.key === 'title')
        if (data) {
          return data.value
        }
      }
      return this.draft.title
    }
  },
  methods: {
    ...mapMutations('proposals', ['clearData']),
    ...mapActions('roles', ['saveRoleProposal']),
    ...mapActions('badges', ['saveBadgeProposal']),
    ...mapActions('payouts', ['savePayoutProposal']),
    ...mapActions('assignments', ['saveAssignmentProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    openUrl () {
      window.open(this.draft.url)
    },
    async onSaveProposal () {
      if (this.type === 'role' || this.type === 'assignment') {
        if (!this.draft.edit && this.draft.startPeriod && this.draft.startPeriod.startDate && new Date(this.draft.startPeriod.startDate).getTime() < Date.now() + new Date().getTimezoneOffset() * 60000 + 7 * 24 * 60 * 60 * 1000) {
          Notify.create({
            color: 'red',
            message: 'The proposal would start before the endorsement. Please change the start cycle.',
            position: 'bottom',
            timeout: 10000,
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
          return
        }
      }
      this.submitting = true
      if (await this[`save${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Proposal`](this.draft)) {
        await this.deleteDraft(this.draft.id)
        this.clearData()
      }
      this.submitting = false
    }
  }
}
</script>

<template lang="pug">
q-card.draft
  .ribbon
    span.text-white.bg-draft DRAFTING
  .url(v-if="draft.url")
    q-btn(
      icon="fas fa-bookmark"
      @click="openUrl"
      flat
      color="draft"
      unelevated
      dense
    )
  top-right-icon(:type="type")
  draft-menu(:type="type" :draft="draft")
  .flex.column.justify-between.full-height
    div
      q-card-section.text-center.q-pb-sm.cursor-pointer.relative-position
        avatar(:type="type" :title="title" :draft="draft")
      q-card-section
        card-title(:type="type" :title="title")
    q-card-actions.q-pa-lg.flex.justify-around.draft-actions
      q-btn(
        label="Propose"
        color="draft"
        rounded
        dense
        unelevated
        :loading="submitting"
      )
        q-popup-proxy
          .confirm.column.q-pa-sm
            | Are you sure you want to publish this proposal? There are no more edits possible after this action.
            .row.flex.justify-between.q-mt-sm
              q-btn(
                color="primary"
                label="No"
                dense
                flat
                v-close-popup
              )
              q-btn(
                color="primary"
                label="Yes"
                dense
                @click="onSaveProposal"
                v-close-popup
              )
</template>

<style lang="stylus" scoped>
.confirm
  min-height 100px
  max-width 250px
.draft
  width 300px
  border-radius 1rem
  margin 10px
.draft:hover
  z-index 100
  box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.draft-actions
  button
    width 45%
    font-weight 700
</style>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import DraftMenu from '~/components/draft-parts/draft-menu'
import TopRightIcon from '~/components/documents-parts/top-right-icon'

export default {
  name: 'assignment-proposal-card-draft',
  mixins: [documents, format],
  props: {
    draft: { type: Object, required: true }
  },
  components: { DraftMenu, TopRightIcon },
  data () {
    return {
      profile: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.draft.role, 'details', 'title')
    },
    annualSalary () {
      return this.getValue(this.draft.role, 'details', 'annual_usd_salary')
    }
  },
  methods: {
    ...mapActions('assignments', ['saveAssignmentProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    async onSaveProposal () {
      if (!this.draft.edit && this.draft.startPeriod && this.draft.startPeriod.startDate &&
          new Date(this.draft.startPeriod.startDate).getTime() < Date.now() + this.$config.contracts.voteDurationSeconds * 1000) {
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
      this.submitting = true
      const draft = {
        ...this.draft,
        title: this.title
      }
      if (await this.saveAssignmentProposal(draft)) {
        this.$emit('proposed')
        await this.deleteDraft(this.draft.id)
      }
      this.submitting = false
    }
  },
  watch: {
    account: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
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
      @click="() => openUrl(draft.url)"
      flat
      color="draft"
      unelevated
      dense
    )
  top-right-icon(type="assignment" :menu="true")
  draft-menu(type="assignment" :draft="draft")
  .flex.column.justify-between.full-height
    div
      q-card-section.text-center.q-pb-sm.cursor-pointer.relative-position(style="height:200px")
        q-img.avatar(
          v-if="profile && profile.publicData && profile.publicData.avatar"
          :src="profile.publicData.avatar"
          @click="$router.push({ path: `/@${account}`})"
        )
        q-avatar.avatar(
          v-if="!profile || !profile.publicData || !profile.publicData.avatar"
          size="150px"
          color="accent"
          text-color="white"
          @click="$router.push({ path: `/@${account}`})"
        )
          | {{ account.slice(0, 2).toUpperCase() }}
        .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
      q-card-section
        .assignee {{ (profile && profile.publicData && profile.publicData.name) || account }}
        .title {{ title }}
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
.avatar
  cursor pointer
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
.title
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.assignee
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
  line-height 1
.draft-actions
  button
    width 45%
    font-weight 700
</style>

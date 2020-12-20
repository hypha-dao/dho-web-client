<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { Notify } from 'quasar'
import { adorableAvatar } from '~/mixins/adorable-avatar'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import DraftMenu from '~/components/draft-parts/draft-menu'
import TopRightIcon from '~/components/documents-parts/top-right-icon'

export default {
  name: 'role-proposal-card-draft',
  mixins: [documents, format, adorableAvatar],
  props: {
    draft: { type: Object, required: true }
  },
  components: { DraftMenu, TopRightIcon },
  data () {
    return {
      avatarSrc: null,
      avatarColor: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.draft.title
    },
    sponsor () {
      return `Sponsored by ${(this.profile && this.profile.publicData && this.profile.publicData.name) || this.account}`
    },
    annualSalary () {
      return this.draft.salaryUsd
    }
  },
  methods: {
    ...mapMutations('proposals', ['clearData']),
    ...mapActions('roles', ['saveRoleProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    openUrl () {
      window.open(this.draft.url)
    },
    async onSaveProposal () {
      if (!this.draft.edit && this.draft.startPeriod && this.draft.startPeriod.startDate && new Date(this.draft.startPeriod.startDate).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000) {
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
      if (await this.saveRoleProposal(this.draft)) {
        this.$emit('proposed')
        await this.deleteDraft(this.draft.id)
        this.clearData()
      }
      this.submitting = false
    }
  },
  watch: {
    title: {
      immediate: true,
      async handler (val) {
        const hash = await this.toSHA256(val)
        const { image, color } = await this.getAdorableImage(hash)
        this.avatarSrc = image
        this.avatarColor = color
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
      @click="openUrl"
      flat
      color="draft"
      unelevated
      dense
    )
  top-right-icon(type="role" :menu="true")
  draft-menu(type="role" :draft="draft")
  .flex.column.justify-between.full-height
    div
      q-card-section.text-center.q-pb-sm.cursor-pointer.relative-position
        q-img.avatar(
          :src="this.avatarSrc"
          :style="`background: ${this.avatarColor}`"
        )
        .salary-bucket.bg-proposal(v-if="annualSalary") {{ getSalaryBucket(parseInt(annualSalary)) }}
      q-card-section.text-center
        .title {{ title }}
        .sponsor(v-if="sponsor") {{ sponsor }}
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
  border-radius 50% !important
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.salary-bucket
  position absolute
  bottom 10px
  right 80px
  color white
  font-size 28px
  font-weight 700
  border-radius 50%
  width 45px
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.title
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
  line-height 1
.sponsor
  color $grey-6
  font-size 16px
  text-align center
.draft-actions
  button
    width 45%
    font-weight 700
</style>

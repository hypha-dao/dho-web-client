<script>
import { mapActions, mapGetters } from 'vuex'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import DraftMenu from '~/components/draft-parts/draft-menu'
import TopRightIcon from '~/components/documents-parts/top-right-icon'

export default {
  name: 'payout-proposal-card-draft',
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
      return this.draft.title
    }
  },
  methods: {
    ...mapActions('payouts', ['savePayoutProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    async onSaveProposal () {
      this.submitting = true
      if (await this.savePayoutProposal(this.draft)) {
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
  top-right-icon(type="payout" :menu="true")
  draft-menu(type="payout" :draft="draft")
  .flex.column.justify-between.full-height
    div
      q-card-section.text-center.cursor-pointer.relative-position
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
      q-card-section
        .recipient {{ (profile && profile.publicData && profile.publicData.name) || account }}
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
  border-radius 50% !important
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.title
  text-align center
  font-size 20px
  color $body
  line-height 22px
.recipient
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

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import removeMd from 'remove-markdown'
import { format } from '~/mixins/format'

export default {
  name: 'draft-proposal-card',
  mixins: [format],
  props: {
    draft: { type: Object, required: true },
    type: { type: String, required: true }
  },
  data () {
    return {
      loading: true,
      details: false,
      profile: null,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    description () {
      if (this.draft.description) {
        return removeMd(this.draft.description).replace(/\n/g, ' ')
      }
      return ''
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.account)
    this.loading = false
  },
  methods: {
    ...mapMutations('proposals', ['clearData']),
    ...mapActions('roles', ['saveRoleProposal']),
    ...mapActions('payouts', ['saveContributionProposal']),
    ...mapActions('assignments', ['saveAssignmentProposal']),
    ...mapActions('profiles', ['getPublicProfile', 'deleteDraft']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    openUrl () {
      window.open(this.draft.url)
    },
    editDraft () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: `${this.type}Form`,
        data: this.draft
      })
    },
    async onSaveProposal () {
      this.submitting = true
      await this[`save${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Proposal`](this.draft)
      await this.deleteDraft(this.draft.id)
      this.submitting = false
      this.clearData()
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
  q-img.owner-avatar(
    v-if="profile && profile.publicData.avatar"
    :src="profile.publicData.avatar"
    @click="$router.push({ path: `/@${account}`})"
  )
    q-tooltip {{ (profile.publicData && profile.publicData.name) || account }}
  q-avatar.owner-avatar(
    v-else
    size="40px"
    color="accent"
    text-color="white"
    @click="$router.push({ path: `/@${account}`})"
  )
    | {{ account.slice(0, 2).toUpperCase() }}
    q-tooltip {{ (profile && profile.publicData && profile.publicData.name) || account }}
  q-btn.card-menu(
    icon="fas fa-ellipsis-v"
    color="grey"
    flat
    dense
    round
    no-caps
    :ripple="false"
    style="width:40px;height:40px;margin: 4px;"
  )
    q-menu
      q-list(dense)
        q-item(
          clickable
          v-close-popup
          @click="deleteDraft(draft.id)"
        )
          q-item-section Delete
  q-card-section.text-center.q-pb-sm
    img.icon(v-if="type === 'role'" src="~assets/icons/roles.svg")
    img.icon(v-if="type === 'assignment'" src="~assets/icons/assignments.svg")
    img.icon(v-if="type === 'contribution'" src="~assets/icons/past.svg")
  q-card-section(@click="details = !details").cursor-pointer
    .type {{ type }}
    .title {{ draft.title }}
  q-card-section.description(v-show="details")
    p {{ description | truncate(150) }}
  q-card-actions.q-pa-lg.flex.justify-around.draft-actions
    q-btn(
      label="edit"
      color="draft"
      rounded
      dense
      unelevated
      @click="editDraft"
    )
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
  transition transform 0.3s cubic-bezier(0.005, 1.65, 0.325, 1) !important
  transform scale(1.2) translate(0px, 40px) !important
  -moz-transform scale(1.2) translate(0px, 40px)
  -webkit-transform scale(1.2) translate(0px, 40px)
  z-index 100
  box-shadow 0 4px 8px rgba(0,0,0,0.2), 0 5px 3px rgba(0,0,0,0.14), 0 3px 3px 3px rgba(0,0,0,0.12)
  .owner-avatar
    z-index 110
.card-menu
  position absolute
  right 0
  top 7px
  width 20px
  z-index 110
  /deep/.q-focus-helper
    display none !important
.owner-avatar
  cursor pointer
  position absolute
  border-radius 50% !important
  right 40px
  top 10px
  width 40px
.description
  white-space pre-wrap
  max-height 55px
  overflow auto
.type
  cursor pointer
  text-transform capitalize
  text-align center
  font-weight 800
  font-size 28px
.title
  cursor pointer
  text-align center
  font-size 20px
  color $grey-6
  line-height 22px
.icon
  margin-top 20px
  width 100%
  max-width 100px
.url
  position absolute
  top -4px
  right 80px
  z-index 12
.draft-actions
  button
    width 45%
</style>

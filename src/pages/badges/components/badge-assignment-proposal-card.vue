<script>
import TopRightIcon from '~/components/proposal-draft-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/proposal-draft-parts/vote-yes-no-abstain'
import { documents } from '~/mixins/documents'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'badge-assignment-proposal-card',
  mixins: [documents],
  props: { proposal: { type: Object, required: true } },
  components: { TopRightIcon, VoteYesNoAbstain },
  data () {
    return {
      profile: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('badges', ['removeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'badgeAssignmentProposalView',
        data: this.proposal
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    assignee () {
      return this.getValue(this.proposal, 'details', 'assignee')
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  watch: {
    assignee: {
      immediate: true,
      async handler (val) {
        this.profile = val && await this.getPublicProfile(val)
      }
    }
  }
}
</script>

<template lang="pug">
q-card.proposal.column
  .ribbon
    span.text-white.creating creating
  top-right-icon(type="badge")
  q-card-section.text-center(@click="showCardFullContent")
    q-img.avatar(
      v-if="profile && profile.publicData && profile.publicData.avatar"
      :src="profile && profile.publicData && profile.publicData.avatar"
    )
    q-avatar.avatar(
      v-if="!profile || !profile.publicData || !profile.publicData.avatar"
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${assignee}`})"
    )
      | {{ assignee.slice(0, 2).toUpperCase() }}
  q-card-section(@click="showCardFullContent")
    .title {{ title }}
    .assignee {{ (profile && profile.publicData && profile.publicData.name) || assignee }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="assignee" :hash="this.proposal.hash" @close-proposal="removeProposal")
</template>

<style lang="stylus" scoped>
.proposal
  width 300px
  border-radius 1rem
  margin 10px
  .proposal:hover
    z-index 100
    box-shadow 0 8px 12px rgba(0,0,0,0.2), 0 9px 7px rgba(0,0,0,0.14), 0 7px 7px 7px rgba(0,0,0,0.12)
  .avatar
    cursor pointer
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .title
    cursor pointer
    text-align center
    font-weight 800
    font-size 28px
    color $grey-10
    line-height 22px
  .assignee
    text-align center
    color $grey-6
    font-size 22px
  .vote-section
    padding 0 28px 10px
</style>

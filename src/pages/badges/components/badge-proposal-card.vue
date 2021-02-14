<script>
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import { documents } from '~/mixins/documents'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'badge-proposal-card',
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
        type: 'badgeProposalView',
        data: this.proposal
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    icon () {
      return this.getValue(this.proposal, 'details', 'icon')
    },
    proposer () {
      return this.proposal.creator
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  watch: {
    proposer: {
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
      v-if="icon && icon !== ''"
      :src="icon"
    )
    q-avatar.avatar(
      v-else
      size="150px"
      color="primary"
      text-color="white"
    )
      | NA
  q-card-section(@click="showCardFullContent")
    .title {{ title }}
    .sponsor Sponsored by {{ (profile && profile.publicData && profile.publicData.name) || proposer }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" :allow-details="true" @close-proposal="removeProposal")
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
    border-radius 50% !important
    cursor pointer
    margin-top 20px
    width 100%
    max-width 150px
    height 150px
  .title
    cursor pointer
    text-align center
    font-size 20px
    color $grey-6
    line-height 22px
  .sponsor
    color $grey-6
    font-size 16px
  .vote-section
    padding 0 28px 10px
</style>

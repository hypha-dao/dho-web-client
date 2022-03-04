<script>
import TopRightIcon from '~/components/documents-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import VoteYesNoAbstainOld from '~/components/documents-parts/vote-yes-no-abstain-old'
import { documents } from '~/mixins/documents'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'payout-proposal-card',
  mixins: [documents],
  props: { proposal: { type: Object, required: true } },
  components: { TopRightIcon, VoteYesNoAbstain, VoteYesNoAbstainOld },
  data () {
    return {
      profile: null
    }
  },
  methods: {
    ...mapActions('profiles', ['getPublicProfile']),
    ...mapMutations('payouts', ['removeProposal']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    showCardFullContent () {
      this.setShowRightSidebar(true)
      this.setRightSidebarType({
        type: 'payoutProposalView',
        data: this.proposal
      })
    }
  },
  computed: {
    ...mapGetters('accounts', ['account']),
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    url () {
      return this.getValue(this.proposal, 'details', 'url')
    },
    recipient () {
      return this.getValue(this.proposal, 'details', 'recipient')
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    }
  },
  watch: {
    recipient: {
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
  .url(v-if="url && url !== 'null'")
    q-btn(
      icon="fas fa-bookmark"
      @click="() => openUrl(url)"
      flat
      color="proposal"
      unelevated
      dense
    )
  top-right-icon(type="payout")
  q-card-section.text-center(@click="showCardFullContent")
    q-img.avatar(
      v-if="profile && profile.publicData && profile.publicData.avatar"
      :src="profile.publicData.avatar"
      @click="$router.push({ path: `/@${recipient}`})"
    )
    q-avatar.avatar(
      v-if="!profile || !profile.publicData || !profile.publicData.avatar"
      size="150px"
      color="accent"
      text-color="white"
      @click="$router.push({ path: `/@${recipient}`})"
    )
      | {{ recipient.slice(0, 2).toUpperCase() }}
  q-card-section(@click="showCardFullContent")
    .recipient {{ (profile && profile.publicData && profile.publicData.name) || recipient }}
    .title {{ title }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="proposal.votetally" :init-proposal="proposal" :proposer="recipient" :hash="this.proposal.hash" :allow-details="true" @close-proposal="removeProposal")
    vote-yes-no-abstain-old(v-else-if="ballotId" :ballotId="ballotId" :proposer="recipient" :hash="this.proposal.hash" :allow-details="true" @close-proposal="removeProposal")
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
  .url
    position absolute
    top -4px
    right 60px
    z-index 12
  .title
    cursor pointer
    text-align center
    font-size 20px
    color $body
    line-height 22px
  .recipient
    cursor pointer
    text-transform capitalize
    text-align center
    font-weight 800
    font-size 28px
    line-height 1
  .vote-section
    padding 0 28px 10px
</style>

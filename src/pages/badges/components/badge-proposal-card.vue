<script>
import TopRightIcon from '~/components/proposal-draft-parts/top-right-icon'
import VoteYesNoAbstain from '~/components/proposal-draft-parts/vote-yes-no-abstain'
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
    details () {
      const details = this.proposal.content_groups.find(cg => cg.contents.some(c => c.label === 'content_group_label' && c.value === 'details'))
      if (details && details.contents.length) {
        return details.contents
      }
      /*
        const title = info.find(c => c.label === 'title') && info.find(c => c.label === 'title').value
        const description = info.find(c => c.label === 'description') && info.find(c => c.label === 'description').value
        const icon = info.find(c => c.label === 'icon') && info.find(c => c.label === 'icon').value
        const seeds = info.find(c => c.label === 'seeds_coefficient_x10000') && info.find(c => c.label === 'seeds_coefficient_x10000').value
        const hypha = info.find(c => c.label === 'hypha_coefficient_x10000') && info.find(c => c.label === 'hypha_coefficient_x10000').value
        const hvoice = info.find(c => c.label === 'hvoice_coefficient_x10000') && info.find(c => c.label === 'hvoice_coefficient_x10000').value
        const husd = info.find(c => c.label === 'husd_coefficient_x10000') && info.find(c => c.label === 'husd_coefficient_x10000').value
        const maxCycles = info.find(c => c.label === 'max_cycles') && info.find(c => c.label === 'max_cycles').value
        const startPeriod = info.find(c => c.label === 'start_period') && info.find(c => c.label === 'start_period').value
        const endPeriod = info.find(c => c.label === 'end_period') && info.find(c => c.label === 'end_period').value
      * */
      return null
    },
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    icon () {
      return this.getValue(this.proposal, 'details', 'icon')
    },
    proposer () {
      return this.getValue(this.proposal, 'system', 'proposer')
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
      v-if="icon"
      :src="icon"
    )
  q-card-section(@click="showCardFullContent")
    .title {{ title }}
    .sponsor Sponsored by {{ (profile && profile.publicData && profile.publicData.name) || proposer }}
  q-card-section.vote-section
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" @close-proposal="removeProposal")
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
    font-size 20px
    color $grey-6
    line-height 22px
  .sponsor
    color $grey-6
    font-size 16px
  .vote-section
    padding 0 28px 10px
</style>

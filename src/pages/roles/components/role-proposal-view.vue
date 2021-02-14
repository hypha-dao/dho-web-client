<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import MarkdownDisplay from '~/components/form/markdown-display'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import VotesDetails from '~/components/documents-parts/votes-details'

export default {
  name: 'role-proposal-view',
  mixins: [documents, format],
  components: { MarkdownDisplay, RawDisplayIcon, VoteYesNoAbstain, VotesDetails },
  props: {
    proposal: { type: Object }
  },
  data () {
    return {
      profile: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'isAdmin', 'isMember', 'account']),
    proposer () {
      return this.proposal.creator
    },
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    },
    title () {
      return this.getValue(this.proposal, 'details', 'title')
    },
    description () {
      return this.getValue(this.proposal, 'details', 'description')
    },
    url () {
      return this.getValue(this.proposal, 'details', 'url')
    },
    minDeferred () {
      return this.getValue(this.proposal, 'details', 'min_deferred_x100')
    },
    usdEquity () {
      return this.getValue(this.proposal, 'details', 'annual_usd_salary')
    },
    ftCapacity () {
      return this.getValue(this.proposal, 'details', 'fulltime_capacity_x100')
    }
  },
  async mounted () {
    this.profile = await this.getPublicProfile(this.proposer)
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('roles', ['removeProposal']),
    ...mapActions('profiles', ['getPublicProfile']),
    onClose () {
      this.removeProposal(this.proposal.hash)
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    open (url) {
      window.open(url, '_blank')
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
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }} ({{ (profile && profile.publicData && profile.publicData.name) || `@${proposer}` }})
    raw-display-icon(:document="proposal")
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the minimum % commitment and % HYPHA tokens vs. HUSD tokens required for this role as well as the role capacity (how many people can be assigned to this role) and USD equivalent.
    .row.q-col-gutter-xs
      .col-4(:style="{width:'33%'}")
        q-input.bg-grey-4.text-black(
          v-model="minDeferred"
          outlined
          dense
          readonly
        )
        .hint Min. hypha
      .col-4(:style="{width:'27%'}")
        q-input.bg-grey-4.text-black(
          v-model="ftCapacity"
          outlined
          dense
          readonly
        )
        .hint ROLE CAP
      .col-4(:style="{width:'40%'}")
        q-input.bg-grey-4.text-black(
          v-model="usdEquity"
          outlined
          dense
          readonly
        )
        .hint Usd equivalent/year
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for the role proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="proposer" :hash="this.proposal.hash" @close-proposal="onClose" :countdown="true")
  votes-details(v-if="ballotId" :ballotId="ballotId" :size="5")
  .row.flex.justify-start.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.link
  color black
  display block
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.vote-bar
  opacity 1
.vote-text
  font-weight 600
.proposal-actions
  button
    font-weight 700
    /deep/i
      font-size 16px
</style>

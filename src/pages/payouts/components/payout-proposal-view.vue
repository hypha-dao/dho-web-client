<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'
import VotesDetails from '~/components/documents-parts/votes-details'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'
import { format } from '~/mixins/format'
import { documents } from '~/mixins/documents'

export default {
  name: 'payout-proposal-view',
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
    ballotId () {
      return this.getValue(this.proposal, 'system', 'ballot_id')
    },
    recipient () {
      return this.getValue(this.proposal, 'details', 'recipient')
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
    tokenSeeds () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'seeds_amount'))
      return this.toAsset(amount || 0)
    },
    tokenHvoice () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'hvoice_amount'))
      return this.toAsset(amount || 0)
    },
    tokenHusd () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'husd_amount'))
      return this.toAsset(amount || 0)
    },
    tokenHypha () {
      const amount = parseFloat(this.getValue(this.proposal, 'details', 'hypha_amount'))
      return this.toAsset(amount || 0)
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('payouts', ['removeProposal']),
    ...mapActions('profiles', ['getPublicProfile']),
    onClose () {
      this.removeProposal(this.proposal.hash)
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
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
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }} ({{ (profile && profile.publicData && profile.publicData.name) || `@${recipient}` }})
    raw-display-icon(:document="proposal")
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm(v-if="url")
    legend Supporting documentation
    a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
  fieldset.q-mt-sm
    legend Payout
    p Fields below display the payout for this contribution as well as % deferred salary. The payout is shown as USD equivalent and the corresponding amounts received in SEEDS, HVOICE, HYPHA and HUSD.
    .row.q-my-sm
      strong SALARY CALCULATION
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="tokenSeeds"
          outlined
          dense
          readonly
        )
        .hint SEEDS
      .col-6
        q-input.bg-liquid.text-black(
          v-model="tokenHusd"
          outlined
          dense
          readonly
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="tokenHvoice"
          outlined
          dense
          readonly
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="tokenHypha"
          outlined
          dense
          readonly
        )
        .hint HYPHA
  fieldset.q-mt-sm
    legend Vote results
    p This is the current tally for this proposal. Please vote with the buttons below. Repeat votes allowed until close.
    vote-yes-no-abstain(v-if="ballotId" :ballotId="ballotId" :proposer="recipient" :hash="this.proposal.hash" @close-proposal="onClose" :countdown="true")
  votes-details(v-if="ballotId" :ballotId="ballotId" :size="5")
  .row.flex.justify-between.q-mt-md
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
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.proposal-actions
  button
    font-weight 700
    /deep/i
      font-size 16px
</style>

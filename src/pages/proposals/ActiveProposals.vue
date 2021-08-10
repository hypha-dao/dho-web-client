<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'active-proposals',
  components: {
    ProposalBanner: () => import('~/components/proposals/proposal-banner'),
    ProposalList: () => import('~/components/proposals/proposal-list'),
    ProposalFilters: () => import('~/components/proposals/proposal-filters')
  },

  meta: {
    title: 'Active Proposals'
  },

  data () {
    return {
      pagination: {
        first: 10,
        offset: 0
      },
      loaded: false,
      proposals: [],
      view: 'list'
    }
  },

  computed: {
    ...mapGetters('ballots', ['supply'])
  },

  created () {
    this.getProposals()
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),

    async getProposals () {
      const active = await this.$dgraphQuery(
        '/proposals/get-active',
        {
          first: this.pagination.first,
          offset: this.pagination.offset
        }
      )

      if (Array.isArray(active)) {
        active.forEach(proposal => {
          let subtitle
          if (proposal.system.type === 'assignment') {
            subtitle = proposal.role[0].details.title
          }

          // Calculate voting
          const voting = {}
          voting.expiration = proposal.ballot.expiration
          if (proposal.votetally && proposal.votetally.length) {
            voting.abstain = parseFloat(proposal.votetally[0].abstain.vote_power)
            voting.pass = parseFloat(proposal.votetally[0].pass.vote_power)
            voting.fail = parseFloat(proposal.votetally[0].fail.vote_power)
          }
          if (voting.pass + voting.fail > 0) {
            voting.unity = Math.round(voting.pass / (voting.pass + voting.fail) * 100) / 100
          } else {
            voting.unity = 0
          }
          if (this.supply > 0) {
            voting.quorum = Math.floor(parseFloat(voting.abstain + voting.pass + voting.fail) / this.supply * 100) / 100
          }

          this.proposals.push({
            uid: proposal.uid,
            data: proposal,
            type: proposal.system.type,
            title: proposal.details.title || proposal.original[0].details.title,
            subtitle,
            proposer: {
              username: proposal.creator
            },
            vote: 'pass', // TODO: Only query the account's vote on dgraph?
            voting,
            view: this.view
          })
        })
      }
    }
  }
}
</script>

<template lang="pug">
.active-proposals.full-width.q-px-xl
  // .row.items-center.justify-between
  .row.q-mt-sm
    proposal-banner
  .row.q-mt-sm
    .col-9.q-px-sm.q-py-md
      proposal-list(:proposals="proposals" :view="view")
    .col-3.q-pa-sm.relative-position
      // q-btn-toggle.absolute-top-right.in-front(
        v-model="view"
        padding="10px"
        size="sm"
        toggle-color="primary"
        :options="[{ value: 'list', icon: 'fas fa-list' },{ value: 'card', icon: 'fas fa-th-large' }]"
      // )
      proposal-filters
</template>

<style lang="stylus" scoped>
.in-front {
  margin-right 32px
  margin-top 32px
  z-index 1
}
</style>

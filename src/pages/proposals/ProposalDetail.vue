<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'proposal-detail',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    Payout: () => import('~/components/contributions/payout.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    VoterList: () => import('~/components/proposals/voter-list.vue'),
    Voting: () => import('~/components/proposals/voting.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    hash: String
  },

  apollo: {
    proposal: {
      query: require('../../query/proposal-detail.gql'),
      update: data => data.getDocument,
      variables () {
        return {
          hash: this.hash
        }
      }
    }
  },

  computed: {
    ...mapGetters('ballots', ['supply'])
  },

  created () {
    if (!this.supply) {
      this.getSupply()
    }
  },

  methods: {
    ...mapActions('ballots', ['getSupply']),

    // TODO: Move this code somewhere shared
    description (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit') {
          return proposal.details_ballotDescription_s
        }
        return proposal.details_description_s
      }
      return null
    },

    periodCount (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          return proposal.details_periodCount_i
        }
      }
      return null
    },

    start (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit' && proposal.original) {
          const date = proposal.original[0].details_startPeriod_c_edge.details_startTime_t
          return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
        if (proposal.__typename === 'Assignment') {
          const date = proposal.details_startPeriod_c_edge.details_startTime_t
          return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }
      }
      return null
    },

    subtitle (proposal) {
      if (proposal.__typename === 'Assignment') {
        return proposal.role[0].details_title_s
      }
      return null
    },

    tags (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Payout') {
          return [
            { color: 'primary', label: 'Contribution' },
            { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Assignment' || proposal.__typename === 'Edit') {
          return [
            { color: 'primary', label: 'Assignment' },
            { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Assignbadge') {
          return [
            { color: 'primary', label: 'Badge' },
            { color: 'primary', outline: true, label: 'Circle One' }
          ]
        }

        if (proposal.__typename === 'Suspend') {
          return [
            { color: 'primary', label: 'Suspension' }
          ]
        }
      }

      return null
    },

    title (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Edit') {
          let extTitle = ''
          if (proposal.original) {
            extTitle = `: ${proposal.original[0].details_title_s}`
          }
          return `${proposal.details_ballotTitle_s}${extTitle}`
        }
        return proposal.details_title_s
      }
      return null
    },

    tokens (proposal) {
      if (proposal) {
        if (proposal.__typename === 'Payout') {
          return [
            {
              label: 'Husd',
              icon: 'husd.svg',
              value: parseFloat(proposal.details_husdAmount_a)
            },
            {
              label: 'HVoice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.details_hvoiceAmount_a)
            },
            {
              label: 'Hypha',
              icon: 'hypha.svg',
              value: parseFloat(proposal.details_hyphaAmount_a)
            }
          ]
        }
        if (proposal.__typename === 'Assignment') {
          return [
            {
              label: 'Husd',
              icon: 'husd.svg',
              value: parseFloat(proposal.details_husdSalaryPerPhase_a)
            },
            {
              label: 'Hvoice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.details_hvoiceSalaryPerPhase_a)
            },
            {
              label: 'Hypha',
              icon: 'hypha.svg',
              value: parseFloat(proposal.details_hyphaSalaryPerPhase_a)
            }
          ]
        }
        if (proposal.__typename === 'Edit' && proposal.original) {
          return [
            {
              label: 'Husd',
              icon: 'husd.svg',
              value: parseFloat(proposal.original[0].details_husdSalaryPerPhase_a)
            },
            {
              label: 'Hvoice',
              icon: 'hvoice.svg',
              value: parseFloat(proposal.original[0].details_hvoiceSalaryPerPhase_a)
            },
            {
              label: 'Hypha',
              icon: 'hypha.svg',
              value: parseFloat(proposal.original[0].details_hyphaSalaryPerPhase_a)
            }
          ]
        }
      }
      return null
    },

    voting (proposal) {
      if (proposal && Array.isArray(proposal.votetally) && proposal.votetally.length) {
        const abstain = parseFloat(proposal.votetally[0].abstain_votePower_a)
        const pass = parseFloat(proposal.votetally[0].pass_votePower_a)
        const fail = parseFloat(proposal.votetally[0].fail_votePower_a)
        const unity = (pass + fail > 0) ? pass / (pass + fail) : 0
        const quorum = this.supply > 0 ? (abstain + pass + fail) / this.supply : 0

        return {
          vote: 'pass',
          unity,
          quorum
        }
      }

      return null
    },

    votes (proposal) {
      if (proposal && Array.isArray(proposal.vote) && proposal.vote.length) {
        const result = []
        proposal.vote.forEach((vote) => {
          result.push({
            date: vote.vote_date_t,
            username: vote.vote_voter_n,
            vote: vote.vote_vote_s,
            strength: vote.vote_votePower_a
          })
        })

        return result
      }

      return []
    },

    openDocumentation () {
      window.open(this.proposal.details_url_s, '_blank')
    }
  }
}
</script>

<template lang="pug">
.proposal-detail.full-width.q-px-xl
  // .row.items-center.justify-between
    q-btn(@click="$router.go(-1)")
      .row.items-center
        q-icon(size="xs" name="fas fa-chevron-left")
        .text-body2 Back
  p(v-if="$apollo.loading") Loading...
  .row(v-else)
    .col-3.q-pa-sm
      payout.q-my-sm(:tokens="tokens(proposal)")
      widget.q-my-sm(v-if="proposal.__typename === 'Assignment' || proposal.__typename === 'Edit'" title="Duration")
        .row.justify-between
          .row.items-center
            q-icon.on-left(name="far fa-calendar-alt")
            .text-body2 Starts {{ start(proposal) }}
          .text-bold {{ periodCount(proposal) }} periods
      widget.q-my-sm(title="Proposer")
        profile-picture(:username="proposal.creator" show-name show-username size="64px")
    .col-6.q-pa-sm
      widget.q-my-sm
        .row
          chips(:tags="tags(proposal)")
        .row.q-my-sm
          .text-h6 {{ title(proposal) }}
          .text-h6.text-italic.text-grey-5 {{ subtitle(proposal) }}
        // .row
          .col-3.text-subtitle1.text-bold Objective
          .col-9.text-body2 Objective text
        // .row
          .col-3.text-subtitle1.text-bold Key Results
          .col-9
            .text-body2 These are results
            ol
              li Result 1
              li Result 2
              li Result 3
        .row
          .col-3.text-subtitle1.text-bold Description
          .col-9
            q-markdown(:src="description(proposal)")
        q-btn.full-width.q-my-lg.q-mt-xl(
          v-if="proposal.details_url_s"
          outline padding="md"
          rounded
          label="See Documentation"
          @click="openDocumentation()"
        )
      // widget.q-my-sm(title="Comments (2)")
        .comment.q-pa-sm
          profile-picture(:username="proposal.creator" show-name show-username size="36px")
          .text-italic 2 days ago
          .text-body2 Res ultor rotae Iovemque palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!
        .comment.q-pa-sm
          profile-picture(:username="proposal.creator" show-name show-username size="36px")
          .text-italic 2 days ago
          .text-body2 Res ultor rotae Iovemque palude lingua. Animas astu ne squamae noctis, in iacent torta vidi tantum addidit cruentior taceam, vertit!
    .col-3.q-pa-sm
      voting.q-my-sm(v-bind="voting(proposal)")
      voter-list.q-my-sm(:votes="votes(proposal)")
</template>

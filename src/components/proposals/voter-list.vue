<script>
import { mapActions } from 'vuex'
import gql from 'graphql-tag'
import paginate from '~/utils/paginate'

const PROPOSAL_VOTES_QUERY = `
  getDocument(docId: $docId) {
    __typename
    docId

    ... on Votable {
      __typename

      voteAggregate {
        count
      }

      vote(first: $first, offset: $offset, order: { desc: createdDate }) {
        username: vote_voter_n
        vote: vote_vote_s
        strength: vote_votePower_a
      }
    }
  }
`

export default {
  name: 'voter-list',
  components: {
    Chips: () => import('~/components/common/chips.vue'),
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue'),
    ProfilePicture: () => import('~/components/profiles/profile-picture.vue'),
    Widget: () => import('~/components/common/widget.vue')
  },

  props: {
    proposalId: String
  },

  data () {
    return {
      page: 0,
      size: 5,
      voices: {},
      voteCount: 0
    }
  },

  apollo: {
    votes: {
      query: gql`query proposalVotes($docId: String!, $first: Int!, $offset: Int!) { ${PROPOSAL_VOTES_QUERY} }`,
      update: data => data.getDocument.vote,
      skip () { return !this.proposalId },
      variables () {
        return {
          docId: this.proposalId,
          first: this.size,
          offset: this.page * this.size
        }
      },

      result ({ data }) {
        this.voteCount = data?.getDocument?.voteAggregate?.count
      },
      fetchPolicy: 'no-cache',
      subscribeToMore: {
        document: gql`subscription proposalVotes($docId: String!, $first: Int, $offset: Int) { ${PROPOSAL_VOTES_QUERY} }`,
        skip () { return !this.proposalId },
        variables () { return { docId: this.proposalId } },
        updateQuery: (previousResult, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return previousResult
          }
          if (!previousResult) {
            return undefined
          }

          return subscriptionData.data
        }

      }

    }
  },

  computed: {
    isFirstPage () { return this.pageCount === 0 ? true : this.page + 1 === 1 },
    isLastPage () { return this.pageCount === 0 ? true : this.page + 1 === this.pageCount },
    isLoading () { return this.$apollo.queries.votes.loading },
    pageCount () { return Math.ceil(this.voteCount / 5) },

    votesPaginated () {
      return (!this.votes || this.isLoading) ? [] : paginate(this.votes, this.page, this.size)
    }
  },

  methods: {
    ...mapActions('profiles', ['getVoiceToken']),
    ...mapActions('treasury', { getTreasurySupply: 'getSupply' }),

    tag (vote) {
      if (vote.vote === 'pass') {
        return {
          label: 'Yes',
          color: 'positive'
        }
      }
      if (vote.vote === 'fail') {
        return {
          label: 'No',
          color: 'negative'
        }
      }
      if (vote.vote === 'abstain') {
        return {
          label: 'Abstain',
          color: 'disabled'
        }
      }
      return { label: '', color: '' }
    },

    async loadVoiceTokenPercentage ({ username, strength }) {
      // TODO: Check if this is edge case or bad code from past
      //   if (this.proposal && this.proposal.details_ballotSupply_a) {
      //       const [supplyAmount, token] = this.proposal.details_ballotSupply_a.split(' ')
      //       const percentage = calcVoicePercentage(vote.vote_votePower_a.split(' ')[0], supplyAmount)
      //   } else {

      const [supplyTokens, voiceToken] = await Promise.all([
        this.getTreasurySupply(),
        this.getVoiceToken(username)
      ])
      const supplyHVoice = parseFloat(supplyTokens[voiceToken.token])
      const userHVoice = parseFloat(voiceToken.amount)

      if (supplyHVoice && userHVoice) {
        // TODO: Check if this is edge case or bad code from past
        // if (parseFloat(voiceToken.amount) === parseFloat(strength)) {
        //   percentage = supplyHVoice ? calcVoicePercentage(parseFloat(voiceToken.amount), supplyHVoice) : '0.0'
        // } else {
        //   percentage = supplyHVoice ? calcVoicePercentage(parseFloat(strength), supplyHVoice) : '0.0'
        // }

        const percent = parseFloat((userHVoice / supplyHVoice) * 100).toFixed(2)

        this.$set(this.voices, username, percent > 0.1 ? percent : 0.1)
      }
    }
  },

  watch: {
    votes: {
      immediate: true,
      deep: true,
      async handler (votes) {
        if (votes) {
          const loadedVoters = Object.keys(this.voices)
          const notLoadedVoters = votes.filter(_ => !loadedVoters.includes(_.username))
          await Promise.all(notLoadedVoters.map(this.loadVoiceTokenPercentage))
        }
      }
    }

  }

}
</script>

<template lang="pug">
widget(:title="$t('proposals.voter-list.votes')" bar)
  template(v-slot:header)
    .h-h2.text-secondary {{ voteCount }}

  section(v-if="isLoading")
    .row.justify-center.q-my-md
      loading-spinner(color="primary" size="40px")
  template(v-else v-for="vote of votesPaginated")
    .row.items-center.justify-between.q-my-md(:key="vote.username")
      profile-picture(
        :username="vote.username"
        limit
        link
        noMargins
        show-name
        size="40px"
      )
        template(v-slot:detail)
          .h-b3.text-italic.text-grey-6.q-pa-none.q-ma-none
            span(v-if="voices[vote.username]") {{ voices[vote.username] }}% HVOICE
            q-skeleton(v-else type="text")
      q-chip.h-tag.tag(dense text-color="white" v-bind="{...tag(vote)}")

  nav.row.justify-between(v-if="voteCount > 0")
    q-btn.round-circle(
      :disable="isFirstPage"
      :ripple="false"
      @click="page--"
      color="inherit"
      icon="fas fa-chevron-left"
      round
      size="sm"
      text-color="primary"
      unelevated
    )
    span(v-if="pageCount > 0") {{ page + 1 }} of {{ pageCount }}
    q-btn.round-circle(
      :disable="isLastPage"
      :ripple="false"
      @click="page++"
      color="inherit"
      icon="fas fa-chevron-right"
      round
      size="sm"
      text-color="primary"
      unelevated
    )

</template>

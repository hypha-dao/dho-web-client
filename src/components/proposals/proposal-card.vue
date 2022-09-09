<script>
/**
 * A widget containing brief details of a single proposal
 */
import { format } from '~/mixins/format'
import { proposals } from '~/mixins/proposals'

export default {
  name: 'proposal-card',
  components: {
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('./voting-result.vue'),
    ProposalCardChips: () => import('./proposal-card-chips.vue')
  },
  mixins: [format, proposals],

  props: {
    /**
     * Whether the card is a list style (horizontal orientation)
     * or card style (vertical orientation)
     */
    view: String,
    /**
     * The data to fill the proposal card with
     */
    proposal: Object,

    updateProposals: Promise
  },
  mounted () {
    this.counterdown = setInterval(() => {
      this.timeLeftString()
      this.$forceUpdate()
    }, 1000)
  },
  activated () {
    this.counterdown = setInterval(() => {
      this.timeLeftString()
      this.$forceUpdate()
    }, 1000)
  },
  deactivated () {
    clearInterval(this.counterdown)
  },
  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    color () {
      if (this.isAccepted) {
        return 'positive'
      }
      return 'negative'
    },

    voteTitle () {
      if (this.voteConfig === null) return ''
      const { vote } = this.voteConfig
      if (vote === 'pass') return 'Yes'.toUpperCase()
      if (vote === 'abstain') return 'Abstain'.toUpperCase()
      if (vote === 'fail') return 'No'.toUpperCase()
      return ''
    },
    background () {
      if (this.voteConfig === null) return 'white'
      const { vote } = this.voteConfig
      if (vote === 'pass') return 'positive'
      if (vote === 'abstain') return 'grey'
      if (vote === 'fail') return 'negative'
      return 'white'
    },
    proposalStatus () {
      return this.isAccepted ? 'Proposal accepted' : 'Proposal rejected'
    }
  },
  methods: {
    getCommentCount () {
      if (this.proposal.cmntsect === undefined) {
        return 0 // No comment section related variable at all
      } else if (this.proposal.cmntsect[0] === undefined) {
        return 0 // No comment section
      }
      return this.proposal.cmntsect[0].comment.filter(comment => comment.deletedStatus !== 1).length
    }
  }
}
</script>

<template lang="pug">
//- widget.cursor-pointer.q-mb-md(
//-   :class="{ 'full-width': list, 'q-mr-md': card }"
//-   :style="{ 'max-width': card ? '320px' : 'inherit' }"
//-   :outlined="expired"
//-   :color="color"
//-   :background="expired ? 'internal-bg' : 'white'"
//-   @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
//- )
widget.cursor-pointer.card(
  :color="color"
  noPadding
  :background="background"
  :class="{ 'full-width': list}"
  @click.native="$router.push({ name: 'proposal-detail', params: {docId, updateProposals} })"
)
  .row.justify-center.items-center
    div(
      :style="{ 'min-height': card ? '344px': '145px', 'max-width': card ? '302px' : '940px', 'full-width': list, 'background': 'white' }"
      :class="{'q-px-lg': card, 'q-py-xl': card, 'q-px-xl': list, 'col': list}"
      ).round-corners.overflow-hidden.relative
      q-skeleton(v-if="proposal.loading").absolute-full.round-corners

      .row.items-center.justify-between(v-else)
        //- q-btn.absolute-top-right.vote-btn(v-if="vote" :color="vote.color" round :icon="vote.icon" size="sm" padding="sm")
          q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }"
            ) You voted '{{ vote.vote }}' on this proposal
        .col-8(:class="{ 'col-12': card}" :style="{ height: list ? 'inherit' : '145px' }")
          .row.items-center
            proposal-card-chips(:type="type" :state="status" :showVotingState="false" :accepted="isAccepted" :compensation="compensation" :salary="salary" :commit="commit && commit.value")
            //- .q-my-auto.h-b3.text-italic.text-body(v-if="subtitle && list") {{ subtitle }} //- Removed subtitle
          //- .row.two-lines
          //- .q-mb-xxs.h-b3.text-italic.text-body(v-if="subtitle && card") {{ subtitle }} //- Removed subtitle
          .h-h5.two-lines(v-if="title" :class="{ 'one-line': list }") {{ title }}
          .row.items-center
            .row.q-mr-md
              profile-picture(
                :username="creator"
                showName
                lightName
                size="20px"
              )
            .row.items-center.q-ml-sm(v-if="list")
              q-icon(v-show="status !== 'drafted'" name="fas fa-hourglass-half")
              .h-b2.text-center.text-body.q-ml-xs.q-mr-md.q-mr-xxxl(v-show="status !== 'drafted'") {{ timeLeftString() }}
              q-icon(name="far fa-comment-alt")
                .h-b2.text-center.text-body.q-ml-xs {{ getCommentCount() }}
        .col-4(v-show="status !== 'drafted'" :class="{ 'col-12': card }")
          voting-result(v-if="(!isVotingExpired && !isAccepted) || (!isVotingExpired && isAccepted)"
                        v-bind="voting"
                        :expired="isVotingExpired"
                        :colorConfig="colorConfig"
                        :colorConfigQuorum="colorConfigQuorum").q-my-xl
          .row.status-border.q-pa-xs.justify-center.q-my-xxxl(v-else :class="{'text-positive' : isVotingExpired && isAccepted, 'text-negative': isVotingExpired && !isAccepted }")
            .col-1.flex.items-center.justify-center
              q-icon(:name="isVotingExpired && isAccepted ? 'fas fa-check' : 'fas fa-times'").q-ml-xs
            .col
              .h-b2.text-center(:class="{ 'text-positive': isVotingExpired && isAccepted, 'text-negative': isVotingExpired && !isAccepted }") {{ proposalStatus }}
            .col-1
        .col-12(v-if="card").justify-between
          .row.items-center.float-left
              q-icon(v-show="status !== 'drafted'" name="fas fa-hourglass-half" size="11px")
              .h-b2.text-center.text-body.q-ml-xs(v-show="status !== 'drafted'") {{ timeLeftString() }}
          .row.items-center.float-right
              q-icon(name="far fa-comment-alt")
              .h-b2.text-center.text-body.q-ml-xs {{ getCommentCount() }}
      .h-b2.text-center.text-white.indicator(v-if="card || list" :class="{ 'rotate-text': list }") {{ voteTitle }}
</template>

<style lang="stylus" scoped>
.round-corners
  border-radius: 25px

.two-lines,
.one-line
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  height: 57px
.one-line
  -webkit-line-clamp: 1
  max-width: 439px
  height: auto
.vote-btn
  margin-right -8px
  margin-top -8px
.horizontal-flex
  flex-direction: 'row'
.indicator
  flex: 0.1
.container-widget
  flex: 1 0 auto
.rotate-text
  writing-mode: vertical-rl
  transform: rotate(-180deg)
  display: flex
  align-items: center
  max-width 25px
.status-border
  border: 2px solid currentColor
  border-radius: $button-rounded-border-radius
.text-limit
  max-width: 440px
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  line-clamp: 2
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
</style>

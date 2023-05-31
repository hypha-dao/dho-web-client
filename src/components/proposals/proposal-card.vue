<script>
/**
 * A widget containing brief details of a single proposal
 */
import { format } from '~/mixins/format'
import { proposals } from '~/mixins/proposals'
import { COLOR_TYPE, PROPOSAL_STATE, VOTE_STATUS } from '~/const'

export default {
  name: 'proposal-card',
  components: {
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('./voting-result.vue'),
    ProposalCardChips: () => import('./proposal-card-chips.vue')
  },
  mixins: [format, proposals],
  data () {
    return {
      PROPOSAL_STATE,
      COLOR_TYPE,
      VOTE_STATUS
    }
  },
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
    fullWidth: Boolean
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
        return COLOR_TYPE.POSITIVE
      }
      return COLOR_TYPE.NEGATIVE
    },

    voteTitle () {
      if (this.voteConfig === null) return ''
      const { vote } = this.voteConfig
      if (vote === VOTE_STATUS.PASS) return 'Yes'.toUpperCase()
      if (vote === VOTE_STATUS.ABSTAIN) return 'Abstain'.toUpperCase()
      if (vote === VOTE_STATUS.FAIL) return 'No'.toUpperCase()
      return ''
    },
    background () {
      if (this.$router.currentRoute.name === 'proposal-history') {
        if (this.isAccepted) {
          return COLOR_TYPE.POSITIVE
        } else {
          return COLOR_TYPE.NEGATIVE
        }
      } else {
        if (this.voteConfig === null) return COLOR_TYPE.WHITE
        const { vote } = this.voteConfig
        if (vote === VOTE_STATUS.PASS) return COLOR_TYPE.POSITIVE
        if (vote === VOTE_STATUS.ABSTAIN) return COLOR_TYPE.GREY
        if (vote === VOTE_STATUS.FAIL) return COLOR_TYPE.NEGATIVE
      }
      return COLOR_TYPE.WHITE
    },
    proposalStatus () {
      return this.isAccepted ? 'Passed' : 'Not passed'
    },
    parentCircleName () {
      if (this.proposal?.parentcircle?.[0].name) {
        const name = this.proposal?.parentcircle?.[0].name
        if (name.toLowerCase().includes('circle')) {
          return name
        } else {
          return name + ' Circle'
        }
      } else {
        return ''
      }
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
widget.cursor-pointer.card.relative(
  :background="background"
  :class="{ 'full-width': list || fullWidth}"
  :color="color"
  :style="{ 'min-height': card ? '344px': '145px', 'max-width': (card && !fullWidth) ? '302px' : '940px', 'full-width': list || fullWidth, 'background': 'white' }"
  @click.native="$router.push({ name: 'proposal-detail', params: { docId } })"
  noPadding
)
  div.bg-internal-bg.absolute.flex.items-center.justify-center(v-if="status === PROPOSAL_STATE.DRAFTED" :style="{ 'right': '20px', 'top': '20px', 'width': '30px', 'height': '30px', 'border-radius': '50%' }")
    q-icon(name="fas fa-hourglass-half" color="white")
  .row.justify-center.items-center
    div(
      :style="{ 'min-height': card ? '344px': '145px', 'background': 'white' }"
      :class="{'q-px-lg': card, 'q-py-xl': card, 'q-px-xl': list, 'col': list, 'justify-center': list}"
      ).round-corners.overflow-hidden.relative.full-width.full-height.flex.column
      q-skeleton(v-if="proposal.loading").absolute-full.round-corners

      .row.items-center.justify-between(v-else)
        //- q-btn.absolute-top-right.vote-btn(v-if="vote" :color="vote.color" round :icon="vote.icon" size="sm" padding="sm")
          q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }"
            ) You voted '{{ vote.vote }}' on this proposal
        .col-8(:class="{ 'col-12': card}" :style="{ height: list ? 'inherit' : '145px' }")
          .row.items-center
            proposal-card-chips(:proposal="proposal" :type="type" :state="status" :showVotingState="false" :accepted="isAccepted" :compensation="compensation" :salary="salary" :commit="commit && commit.value")
            //- .q-my-auto.h-b3.text-italic.text-body(v-if="subtitle && list") {{ subtitle }} //- Removed subtitle
          //- .row.two-lines
          //- .q-mb-xxs.h-b3.text-italic.text-body(v-if="subtitle && card") {{ subtitle }} //- Removed subtitle
          .h-b2.text-italic.q-mt-xs {{ parentCircleName }}
          .h-h5.two-lines(v-if="title" :class="{ 'one-line': list }") {{ title }}
          .row.items-center
            .row.q-mr-md
              profile-picture(
                :username="creator"
                showName
                lightName
                size="20px"
                noMargins
              )
            .row.items-center.q-ml-sm(v-if="list")
              q-icon(name="far fa-comment-alt")
              .h-b2.text-center.text-body.q-ml-xs.q-mr-md.q-mr-xxxl {{ getCommentCount() }} comments
              q-icon(name="fas fa-hourglass-half")
              .h-b2.text-center.text-body.q-ml-xs {{ timeLeftString() }}
        .col-4(v-show="status !== PROPOSAL_STATE.DRAFTED" :class="{ 'col-12': card }")
          voting-result(
            v-bind="voting"
            :expired="isVotingExpired"
            :colorConfig="colorConfig(true)"
            :colorConfigQuorum="colorConfigQuorum(true)").q-my-xl
        .col-12(v-if="card").justify-between
          .row.items-center.float-left
              q-icon(name="fas fa-hourglass-half" size="11px")
              .h-b2.text-center.text-body.q-ml-xs {{ timeLeftString() }}
          .row.items-center.float-right
              q-icon(name="far fa-comment-alt")
              .h-b2.text-center.text-body.q-ml-xs {{ getCommentCount() }}
        template(v-if="$router.currentRoute.name === 'proposal-history'")
          .row.items-center.float-left.q-mt-sm(v-if="voteTitle")
            q-icon(name="fas fa-vote-yea" size="12px")
            .h-b2.text-center.text-body.q-ml-xs {{ `You voted: ${voteTitle}` }}
          .row(v-else :style="{ 'padding-bottom': '54px' }")
    .h-b2.text-center.text-white.indicator.text-no-wrap(v-if="$router.currentRoute.name === 'proposal-history'") {{ proposalStatus }}
    .h-b2.text-center.text-white.indicator(v-else) {{ voteTitle }}
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
.status-title
  font-size: 13px
  font-weight: 600
  color: #F99F17
  font-family: Lato, sans-serif
.text-limit
  max-width: 440px
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  line-clamp: 2
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
</style>

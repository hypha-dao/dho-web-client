<script>
/**
 * A widget containing brief details of a single proposal
 */
export default {
  name: 'proposal-card',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('./voting-result.vue')
  },

  props: {
    /**
     * The hash of the proposal used to uniquely identify it
     */
    hash: String,
    /**
     * The type of this proposal
     */
    type: String,
    /**
     * The title of this proposal
     */
    title: String,
    /**
     * The subtitle displayed in italics below the title
     */
    subtitle: String,
    /**
     * The username of the individual who created the proposal
     */
    proposer: String,
    /**
     * The vote the user made on this proposal
     */
    vote: Object,
    /**
     * The tally of votes for this proposal
     */
    voting: Object,
    /**
     * The expiration string for this proposal
     */
    expiration: String,
    /**
     * Whether the card is a list style (horizontal orientation)
     * or card style (vertical orientation)
     */
    view: String
  },

  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    accepted () {
      return (this.voting && this.voting.quorum >= 0.20 && this.voting.unity >= 0.80)
    },

    color () {
      if (this.accepted) {
        return 'positive'
      }

      return 'negative'
    },

    expired () {
      return this.timeLeft < 0
    },

    tags () {
      if (this.type === 'Payout') {
        return [
          { color: 'primary', label: 'Contribution' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Assignment' }
          // { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'grey-4', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge' },
          { color: 'primary', outline: true, label: 'Assign' }
          // { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Suspend') {
        return [
          { color: 'primary', label: 'Suspension' }
        ]
      }

      if (this.type === 'Role') {
        return [
          { color: 'primary', label: 'Archetype' }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'primary', label: 'Badge' }
        ]
      }

      return null
    },

    timeLeft () {
      const end = new Date(`${this.expiration}`).getTime()
      const now = Date.now()
      const t = end - now
      return t
    },

    timeLeftString () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60

      if (this.timeLeft > 0) {
        const days = Math.floor(this.timeLeft / MS_PER_DAY)
        const hours = Math.floor((this.timeLeft % MS_PER_DAY) / MS_PER_HOUR)
        const dayStr = days ? `${days}d ` : ''
        const hourStr = hours ? `${hours}hr${hours > 1 ? 's ' : ' '}` : ''
        return `The vote will close in ${dayStr}${hourStr}`
      }

      return this.accepted ? 'Proposal accepted' : 'Proposal rejected'
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
//-   :background="expired ? 'grey-4' : 'white'"
//-   @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
//- )
widget.cursor-pointer.q-mb-md(
  :class="{ 'full-width': list, 'q-mr-md': card , 'horizontal-flex': list}"
  :style="{ 'max-width': card ? '320px' : 'inherit' }"
  :color="color"
  noPadding
  :background="expired ? 'negative' : 'white'"
  @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
)
  div(
    :class="{ 'flex': list, 'items-center': list }"
  )
    widget.container-widget(
      background="white"
    )
      q-btn.absolute-top-right.vote-btn(v-if="vote" :color="vote.color" round :icon="vote.icon" size="sm" padding="sm")
        q-tooltip(anchor="top middle" self="bottom middle" :content-style="{ 'font-size': '1em' }"
          ) You voted '{{ vote.vote }}' on this proposal
      .row.items-center.justify-between.q-my-md
        .col-8(:class="{ 'col-12': card, 'q-my-sm': card }" :style="{ height: list ? 'inherit' : '148px' }")
          .row.items-center.q-mb-sm
            chips(v-if="tags" :tags="tags")
          .text-body2.text-italic.text-grey-6(v-if="subtitle") {{ subtitle }}
          .text-bold.text-body1.one-line(v-if="title") {{ title }}
          .q-mt-sm
            .row.items-center.q-gutter-md
              profile-picture(
                :username="proposer"
                showUsername
                size="30px"
              )
              //.row.items-center
                // q-icon.on-left(name="far fa-clock" color="grey-7")
              //- .text-body2.text-italic(v-if="list"
                :class="{ 'text-grey-6': !expired, 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
              //- ) {{ timeLeftString }}
        .col-4(:class="{ 'col-12': card, 'q-my-sm': card, 'q-mt-xl': card }")
          voting-result(v-bind="voting" :expired="expired")
        //- .col-12.q-mt-sm(v-if="card")
        //-   .text-body2.text-italic.text-center(
        //-     :class="{ 'text-grey-6': !expired, 'text-positive': expired && accepted, 'text-negative': expired && !accepted }"
        //-   ) {{ timeLeftString }}
      .q-mb-md(v-if="card")
    .text-body2.text-italic.text-center.text-white.indicator(v-if="card || list" :class="{ 'rotate-text': list }") {{ timeLeftString }}
</template>

<style lang="stylus" scoped>
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
</style>

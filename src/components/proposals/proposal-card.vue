<script>
export default {
  name: 'proposal-card',
  components: {
    Chips: () => import('../common/chips.vue'),
    ProfilePicture: () => import('../profiles/profile-picture.vue'),
    Widget: () => import('../common/widget.vue'),
    VotingResult: () => import('./voting-result.vue')
  },

  props: {
    hash: String,
    type: String,
    title: String,
    subtitle: String,
    proposer: String,
    vote: String,
    voting: Object,
    expiration: String,
    view: String
  },

  computed: {
    list () {
      return this.view === 'list'
    },

    card () {
      return this.view === 'card'
    },

    icon () {
      if (this.voting.vote === 'pass') return 'fas fa-check-circle'
      if (this.voting.vote === 'fail') return 'fas fa-times-circle'
      if (this.voting.vote === 'abstain') return 'fas fa-minus-circle'
      return 'fas fa-question-circle'
    },

    color () {
      if (this.voting.vote === 'pass') return 'positive'
      if (this.voting.vote === 'fail') return 'negative'
      if (this.voting.vote === 'abstain') return 'warning'
      return 'grey-5'
    },

    tags () {
      if (this.type === 'Payout') {
        return [
          { color: 'primary', label: 'Contribution' },
          { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      if (this.type === 'Assignment' || this.type === 'Edit') {
        return [
          { color: 'primary', label: 'Assignment' },
          { color: 'primary', outline: true, label: 'Circle One' }
          // { color: 'primary', label: 'B3' },
          // { color: 'grey-4', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Assignbadge') {
        return [
          { color: 'primary', label: 'Badge' },
          { color: 'primary', outline: true, label: 'Circle One' }
        ]
      }

      return null
    },

    timeLeft () {
      const MS_PER_DAY = 1000 * 60 * 60 * 24
      const MS_PER_HOUR = 1000 * 60 * 60

      const end = new Date(`${this.expiration}`).getTime()
      const now = Date.now()
      const t = end - now
      if (t >= 0) {
        const days = Math.floor(t / MS_PER_DAY)
        const hours = Math.floor((t % MS_PER_DAY) / MS_PER_HOUR)
        const dayStr = days ? `${days}d ` : ''
        const hourStr = hours ? `${hours}hr${hours > 1 ? 's ' : ' '}` : ''
        return `${dayStr}${hourStr}left`
      }

      return 'Voting period ended'
    }
  }
}
</script>

<template lang="pug">
widget.cursor-pointer(
  :class="{ 'full-width': list }"
  :style="{ 'max-width': card ? '320px' : 'inherit' }"
  @click.native="$router.push({ name: 'proposal-detail', params: { hash } })"
)
  .row.items-center.justify-between
    // .nudge-left(v-if="list")
      q-icon(:name="icon" :color="color" size="lg")
    .col-8(:class="{ 'col-12': card, 'q-my-sm': card }" :style="{ height: list ? 'inherit' : '148px' }")
      .row.justify-between.q-mb-sm
        chips(v-if="tags" :tags="tags")
        // q-icon(v-if="card" name="fas fa-check-circle" color="positive" size="lg")
      .text-bold.text-body1.one-line(v-if="title") {{ title }}
      .text-grey-6.text-italic.text-body1(v-if="subtitle") {{ subtitle }}
      .q-mt-sm
        .row.items-center.q-gutter-md
          profile-picture(
            :username="proposer"
            show-name
            show-username
            size="36px"
          )
          .row.items-center
            q-icon.on-left(name="fas fa-dollar-sign" color="grey-7")
            .text-grey-6.text-caption TBD
          .row.items-center
            q-icon.on-left(name="far fa-clock" color="grey-7")
            .text-grey-6.text-caption {{ timeLeft }}
    .col-4(:class="{ 'col-12': card, 'q-my-sm': card, 'q-mt-xl': card }")
      voting-result(v-bind="voting")
  .q-mb-md(v-if="card")
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -12px
  margin-right 20px
</style>

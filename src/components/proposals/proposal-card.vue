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
    uid: String,
    type: String,
    title: String,
    subtitle: String,
    proposer: Object,
    vote: String,
    voting: Object,
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
      if (this.type === 'Contribution') {
        return [
          { color: 'warning', label: this.type },
          { color: 'primary', label: '$$$', tooltip: '34.000 HUSD' }
        ]
      }

      if (this.type === 'Assignment') {
        return [
          { color: 'positive', label: this.type },
          { color: 'primary', label: 'B3' },
          { color: 'grey-4', label: '80%', text: 'grey-7' }
        ]
      }

      if (this.type === 'Quest') {
        return [
          { color: 'negative', label: this.type },
          { color: 'primary', label: '$$$', tooltip: '34.000 HUSD' }
        ]
      }

      if (this.type === 'Badge') {
        return [
          { color: 'black', label: this.type }
        ]
      }

      return null
    }
  }
}
</script>

<template lang="pug">
widget.cursor-pointer(
  :class="{ 'full-width': list }"
  :style="{ 'max-width': card ? '320px' : 'inherit' }"
  @click.native="$router.push({ name: 'proposal-detail', params: { uuid: uid } })"
)
  .row.items-center.justify-between
    // .nudge-left(v-if="list")
      q-icon(:name="icon" :color="color" size="lg")
    .col-8(:class="{ 'col-12': card, 'q-my-sm': card }" :style="{ height: list ? '96px' :' 128px' }")
      .row.justify-between.q-mb-sm
        chips(v-if="tags" :tags="tags")
        q-icon(v-if="card" name="fas fa-check-circle" color="positive" size="lg")
      .text-bold.text-body1(v-if="title") {{ title }}
        span.text-italic.text-body1.on-right(v-if="subtitle") {{ subtitle }}
      .q-mt-sm
        .row.items-center.q-gutter-md
          profile-picture(v-bind="proposer" show-name size="24px")
          .row.items-center
            q-icon.on-left(name="far fa-clock" color="grey-7")
            .text-caption 1d 12hrs left
          .row.items-center
            q-icon.on-left(name="fas fa-dollar-sign" color="grey-7")
            .text-caption 10.000
    .col-4(:class="{ 'col-12': card, 'q-my-sm': card, 'q-mt-xl': card }")
      voting-result(v-bind="voting")
  .q-mb-md(v-if="card")
</template>

<style lang="stylus" scoped>
.nudge-left
  margin-left -12px
  margin-right 20px
</style>

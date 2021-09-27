<script>
export default {
  name: 'how-it-works',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  data () {
    return {
      slide: 'vote'
    }
  }
}
</script>

<template lang="pug">
widget.full-width
  q-carousel(
    v-model="slide"
    swipeable
    animated
    padding
    arrows
    height="160px"
    control-color="primary"
  )
    q-carousel-slide(name="vote")
      .row.items-center.justify-between.q-px-md
        q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col.q-px-lg
          .text-h4 How to Participate
          .text-body1.q-mt-md Create a proposal by clicking on
            router-link.q-mx-xs(:to="{ name: 'proposal-create' }") create proposal
            span in the sidebar. The most common proposals are:
          .text-body2.q-ml-lg
            span.text-italic Contribution:
            span.q-ml-xs payouts for specific 1-time, 1-off past or present expenses
          .text-body2.q-ml-lg
            span.text-italic Assignment:
            span.q-ml-xs regular payout per cycle for doing regular work in a circle
    q-carousel-slide(name="vote2")
      .row.items-center.justify-between.q-px-md
        q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col.q-px-lg
          .text-h4 How to Vote
          .text-body1.q-mt-md Every member can vote on every proposal. Read through the
            router-link.q-mx-xs(:to="{ name: 'active-proposals' }") active proposals
            span and vote on the detail page. For each proposal, you may vote Yes, No or Abstain.
    q-carousel-slide(name="vote3")
      .row.items-center.justify-between.q-px-md
        q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col.q-px-lg
          .text-h4 Voting Method
          .text-body1.q-mt-md
            span.q-mr-xs.text-bold 80/20.
            span In order to pass, at least 80% of the cast votes have to be in favor (unity) and at least 20% of the total available votes must be cast (quorum). This is the
            span.q-mx-xs.text-accent 80/20 Voting Method
    q-carousel-slide(name="vote4")
      .row.items-center.justify-between.q-px-md
        q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col.q-px-lg
          .text-h4 Vote Duration
          .text-body1.q-mt-md
            span.q-mr-xs.text-bold 1 week.
            span Each proposal can be voted on for a duration of
            span.q-mx-xs.text-accent 1 week
            span after which it passes if meeting the thresholds for unity and quorum or fails if either is not met.
    q-carousel-slide(name="vote5")
      .row.items-center.justify-between.q-px-md
        q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col.q-px-lg
          .text-h4 Voting Power
          .text-body1.q-mt-md
            span.q-mr-xs.text-bold 1 token = 1 vote.
            span Voting power is determined by the value of your
            span.q-mx-xs.text-accent HVoice tokens
            span which are earned by completing proposals for the organization.
</template>

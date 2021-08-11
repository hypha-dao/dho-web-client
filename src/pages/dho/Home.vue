<script>
export default {
  name: 'dho-home',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },

  data () {
    return {
      slide: 'vote'
    }
  }
}
</script>

<template lang="pug">
.dho-home.q-px-xl
  .row.full-width.relative-position.q-mb-md
    q-btn.absolute-top-right.q-mt-lg.q-mr-lg.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="primary"
    )
    widget.full-width
      .text-h3.q-mt-xl Welcome to Hypha
      .text-body2.q-my-md The DHO is a third generation DAO, a Decentralized Human Organization that rapidly unfolds coordination, payroll, accounting and governance processes for virtual organizations. Our goal is to help organizations that want to move beyond outdated hierarchical structures towards more transparent, participatory and open protocols and tools in line with our networked and interconnected world.
      .row.q-mt-md.q-mb-xl
        q-btn.q-px-lg(rounded color="primary" :to="{ name: 'organization' }") Discover
        q-btn.q-px-lg.q-ml-md(rounded outline color="primary") Documentation
  .row.q-my-md
    .col-3.q-pr-sm
      q-btn.fit(:to="{ name: 'treasury' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md $.$k
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 Hypha Distributed
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-px-sm
      q-btn.fit(:to="{ name: 'active-proposals' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md XX
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 New Proposals
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-px-sm
      q-btn.fit(:to="{ path: 'activity' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md #
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 New Assignments
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-pl-sm
      q-btn.fit(:to="{ name: 'members' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md %%
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 Voter Participation
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
  .row.full-width.q-my-md
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
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      widget(title="News")
        .row.items-center.justify-between
          .text-subtitle1 Preview the new Hypha DHO!
          .text-caption 1 Aug 2021
        .text-body2.q-mt-sm This is a preview of the new Hypha DHO platform, bringing a new look, streamlined navigation and support for the next generation of DHO's! It is a work-in-progress. While still in preview mode, content and design is still subject to change. Feel free to explore the new layout and provide your feedback to the product team! There is a banner located on every page that gives the status for that page. This news feed will include updates as they are added to the preview!
    .col-3.q-pl-sm
      widget(title="New Members")
        .text-caption.q-pl-sm Coming Soon
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1
</style>

<script>
export default {
  name: 'how-it-works',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  data () {
    return {
      slide: '1'
    }
  }
}
</script><template lang="pug">
widget.full-width
  #header-indicator
    .row.justify-between.q-mt-md
      .h-h4.q-pl-md How it works?
  q-carousel(
    v-model="slide"
    swipeable
    animated
    navigation
    :padding="false"
    height="250px"
    control-color="primary"
    class="b2"
    ref="carousel"
  )
    q-carousel-slide(name="1")
      .h-b1.q-mt-sm Create a proposal by clicking on
        router-link.q-mx-xs(:to="{ name: 'proposal-create' }") create proposal
        span in the sidebar. The most common proposals are:
      .h-b2.q-ml-lg
        span.text-italic Contribution:
        span.q-ml-xs payouts for specific 1-time, 1-off past or present expenses
      .h-b2.q-ml-lg
        span.text-italic Assignment:
        span.q-ml-xs regular payout per cycle for doing regular work in a circle
    q-carousel-slide(name="2")
      .row.items-center.justify-between.q-pr-md
        //- q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col
          .h-b1.q-mt-sm Every member can vote on every proposal. Read through the
            router-link.q-mx-xs(:to="{ name: 'proposals' }") active proposals
            span and vote on the detail page. For each proposal, you may vote Yes, No or Abstain.
    q-carousel-slide(name="3")
      .row.items-center.justify-between.q-pr-md
        //- q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col
          .h-b1.q-mt-sm
            span.q-mr-xs.text-bold 80/20.
            span In order to pass, at least 80% of the cast votes have to be in favor (unity) and at least 20% of the total available votes must be cast (quorum). This is the
            span.q-mx-xs.text-accent 80/20 Voting Method
    q-carousel-slide(name="4")
      .row.items-center.justify-between.q-pr-md
        //- q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col
          .h-b1.q-mt-sm
            span.q-mr-xs.text-bold 1 week.
            span Each proposal can be voted on for a duration of
            span.q-mx-xs.text-accent 1 week
            span after which it passes if meeting the thresholds for unity and quorum or fails if either is not met.
    q-carousel-slide(name="5")
      .row.items-center.justify-between.q-pr-md.q-mt-sm
        //- q-icon.on-left(size="120px" name="fas fa-person-booth")
        .col
          .h-b1
            span.q-mr-xs.text-bold 1 token = 1 vote.
            span Voting power is determined by the value of your
            span.q-mx-xs.text-accent HVoice tokens
            span which are earned by completing proposals for the organization.
    template(v-slot:control)
      q-carousel-control(position="bottom-right" )
        q-btn.q-mt-md.round-circle(flat unelevated rounded padding="12px" icon="fas fa-chevron-right"  size="xs" color="primary" @click="$refs.carousel.next()" )
      q-carousel-control(position="bottom-left" )
        q-btn.q-mt-md.round-circle(flat unelevated rounded padding="12px" icon="fas fa-chevron-left"  size="xs" color="primary" @click="$refs.carousel.previous()" )
  //- #indicator
  //-   .row
  //-     .col(v-for="step in [1, 2, 3, 4, 5]")
  //-       .item-indicator.full-width(:class="(parseInt(slide) >= step) ? 'bg-primary' : 'bg-grey-4'")

</template>

<style lang="stylus" scoped>
.item-indicator
  height: 5px
</style>

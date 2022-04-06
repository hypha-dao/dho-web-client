<script>
export default {
  name: 'how-it-works',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  data () {
    return {
      slide: '1',
      titles: ['Ready for voting?', 'Proposing a policy?', 'Applying for a role?', 'Creating a new role?', 'Creating a badge?', 'Launching a quest?']
    }
  },
  computed: {
    title () {
      return this.titles[Number.parseInt(this.slide) - 1]
    }
  }
}
</script><template lang="pug">
widget(:title="title")
  q-carousel(
    v-model="slide"
    swipeable
    animated
    navigation
    :padding="false"
    height="176px"
    control-color="primary"
    class="b2"
    ref="carousel"
  ).q-mt-md
    q-carousel-slide(name="1").no-padding
      .h-b2 You need to both pass quorum (min % of total members participating in the vote) and unity (min % of members endorsing it). Try to find the right level of support before proposing!
    q-carousel-slide(name="2").no-padding
      .h-b2 Create a generic contribution proposal with a descriptive title and clear definition of the policy along with steps to implement the policy..
    q-carousel-slide(name="3").no-padding
      .h-b2 Create a recurring activity for an existing role-assignment and describe why you are a good match with as many details as possible.
    q-carousel-slide(name="4").no-padding
      .h-b2 Create a proposal for an organization asset and pick role-archetype with a descriptive name and clear definition of the role with accountabilities.
    q-carousel-slide(name="5").no-padding
      .h-b2 Create a proposal for an organization asset and pick a badge-type with a name and clear recognition of learning or unlocking achievement or confirming a status level.
    q-carousel-slide(name="6").no-padding
      .h-b2 Create a generic contribution proposal with a descriptive title and clear breakdown of milestones and payouts per milestone along a timeline.

    //- template(v-slot:navigation-icon)
    //-     q-btn.round-circle(flat unelevated rounded padding="6px"  size="xs" color="primary" )
    template(v-slot:control)
      q-carousel-control(position="bottom-right" )
        q-btn.q-mt-md.round-circle(flat unelevated padding="13px" icon="fas fa-chevron-right"  size="xxs" color="primary" @click="$refs.carousel.next()" )
      q-carousel-control(position="bottom-left" )
        q-btn.q-mt-md.round-circle(flat unelevated padding="13px" icon="fas fa-chevron-left"  size="xxs" color="primary" @click="$refs.carousel.previous()" )
  //- #indicator
  //-   .row
  //-     .col(v-for="step in [1, 2, 3, 4, 5]")
  //-       .item-indicator.full-width(:class="(parseInt(slide) >= step) ? 'bg-primary' : 'bg-internal-bg'")

</template>

<style lang="stylus" scoped>
.item-indicator
  height: 5px
.round-circle
  border-radius: 15px
  >>> i
    font-size 13px !important
</style>

<script>
export default {
  name: 'how-it-works',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  data () {
    return {
      slide: '1',
      titles: [
        this.$t('dashboard.how-it-works.readyForVoting'),
        this.$t('dashboard.how-it-works.proposingAPolicy'),
        this.$t('dashboard.how-it-works.applyingForARole'),
        this.$t('dashboard.how-it-works.creatingANewRole'),
        this.$t('dashboard.how-it-works.creatingABadge'),
        this.$t('dashboard.how-it-works.launchingAQuest')
      ]
    }
  },
  computed: {
    title () {
      return this.titles[Number.parseInt(this.slide) - 1]
    }
  }
}
</script>
<template lang="pug">
widget(:title="title")
  q-carousel.b2.q-mt-md(v-model="slide" swipeable="swipeable" animated="animated" navigation="navigation" :padding="false" height="176px" control-color="primary" ref="carousel")
    q-carousel-slide.no-padding(name="1")
      .h-b2 {{ $t('dashboard.how-it-works.youNeedTo') }}
    q-carousel-slide.no-padding(name="2")
      .h-b2 {{ $t('dashboard.how-it-works.createAGeneric') }}
    q-carousel-slide.no-padding(name="3")
      .h-b2 {{ $t('dashboard.how-it-works.createARecurring') }}
    q-carousel-slide.no-padding(name="4")
      .h-b2 {{ $t('dashboard.how-it-works.createAProposal') }}
    q-carousel-slide.no-padding(name="5")
      .h-b2 {{ $t('dashboard.how-it-works.createAProposal1') }}
    q-carousel-slide.no-padding(name="6")
      .h-b2 {{ $t('dashboard.how-it-works.createAGeneric1') }}
    template(v-slot:control)
      q-carousel-control(position="bottom-right")
        q-btn.q-mt-md.round-circle(flat="flat" unelevated="unelevated" padding="13px" icon="fas fa-chevron-right" size="xxs" color="primary" @click="$refs.carousel.next()")
      q-carousel-control(position="bottom-left")
        q-btn.q-mt-md.round-circle(flat="flat" unelevated="unelevated" padding="13px" icon="fas fa-chevron-left" size="xxs" color="primary" @click="$refs.carousel.previous()")

</template>

<style lang="stylus" scoped>
.item-indicator
  height: 5px
.round-circle
  border-radius: 15px
  >>> i
    font-size 13px !important
</style>

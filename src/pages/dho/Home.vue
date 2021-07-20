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
.dho-home.q-px-xl.q-py-md
  .row.full-width.q-my-md.relative-position
    q-btn.absolute-top-right.q-mt-lg.q-mr-lg.q-pa-xs.close-btn(
      flat round size="sm"
      icon="fas fa-times"
      color="primary"
    )
    widget
      .text-h3.q-mt-xl Welcome to Hypha
      .text-body2.q-my-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations). Our mission is to enable blah blah whatever our mission is and other lorem ipsum stuff.
      .row.q-mt-md.q-mb-xl
        q-btn.q-px-lg(rounded color="primary" :to="{ path: '/bm/organization' }") Discover
        q-btn.q-px-lg.q-ml-md(rounded outline color="primary") Documentation
  .row.q-py-sm
    .col-3.q-pr-sm
      q-btn.fit(:to="{ path: '/bm/proposals' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md 5
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 New Proposals
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-px-sm
      q-btn.fit(:to="{ path: '/bm/activity' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md 12
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 New Assignments
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-px-sm
      q-btn.fit(:to="{ path: '/bm/proposals' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md 3
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 New Suspensions
            q-icon.q-pl-xl(color="grey-5" size="xs" name="fas fa-chevron-right")
    .col-3.q-pl-sm
      q-btn.fit(:to="{ path: '/bm/proposals' }" rounded unelevated color="white" size="0.9em")
        .column.q-py-md
          .text-h3.text-bold.text-grey-9.text-left.q-pa-md 73%
          .row.justify-between.items-center
            .text-subtitle2.text-no-wrap.text-grey-7 Passing rate
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
              .text-h4 How we vote
              .text-body1.q-mt-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations).
        q-carousel-slide(name="vote2")
          .row.items-center.justify-between.q-px-md
            q-icon.on-left(size="120px" name="fas fa-person-booth")
            .col.q-px-lg
              .text-h4 How we vote 2
              .text-body1.q-mt-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations).
        q-carousel-slide(name="vote3")
          .row.items-center.justify-between.q-px-md
            q-icon.on-left(size="120px" name="fas fa-person-booth")
            .col.q-px-lg
              .text-h4 How we vote 3
              .text-body1.q-mt-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations).
        q-carousel-slide(name="vote4")
          .row.items-center.justify-between.q-px-md
            q-icon.on-left(size="120px" name="fas fa-person-booth")
            .col.q-px-lg
              .text-h4 How we vote 4
              .text-body1.q-mt-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations).
  .row.full-width.q-my-md
    .col-9.q-pr-sm
      widget(more title="News")
        .row.items-center.justify-between
          .text-subtitle1 Support for Multiple DHOs!
          .text-caption 15 Aug 2021
        .text-body2.q-mt-sm We've released a huge update that greatly streamlines and simplifies blah blah blah this is a lot of news type, we want to have lots of strings for people to read with useful information just for fun. Eventually maybe this can be driven by admin settings?
        .q-mb-xl
        .row.items-center.justify-between
          .text-subtitle1 Support for Multiple DHOs!
          .text-caption 15 Aug 2021
        .text-body2.q-mt-sm We've released a huge update that greatly streamlines and simplifies blah blah blah this is a lot of news type, we want to have lots of strings for people to read with useful information just for fun. Eventually maybe this can be driven by admin settings?
        .q-mb-xl
        .row.items-center.justify-between
          .text-subtitle1 Support for Multiple DHOs!
          .text-caption 15 Aug 2021
        .text-body2.q-mt-sm We've released a huge update that greatly streamlines and simplifies blah blah blah this is a lot of news type, we want to have lots of strings for people to read with useful information just for fun. Eventually maybe this can be driven by admin settings?
    .col-3.q-pl-sm
      widget(title="New Members")
        .text-caption.q-pl-sm Catherine Parr
        .text-caption.q-pl-sm Catherine Howard
        .text-caption.q-pl-sm Anne of Cleaves
        .text-caption.q-pl-sm Jane Seymour
        .text-caption.q-pl-sm Anne Boleyn
        .text-caption.q-pl-sm Catherine of Aragon
</template>

<style lang="stylus" scoped>
.close-btn
  z-index 1
</style>

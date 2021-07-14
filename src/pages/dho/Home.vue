<script>
export default {
  name: 'dho-home',
  components: {
    Widget: () => import('~/components/common/widget.vue')
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
      .text-body2.q-my-md Hypha builds the tools that enable governance and payroll for DHOs (decentralized 'human' organizations). Our mission is to enable blah blah whatever our mission is and other lorem ipsum stuff. Our members activities are approved via a proposal voting process as follows:
      ol
        li Propose a contribution, apply for an assignment, or start a quest
        li Proposals can be voted on members for 1 week
        li Member votes are weighted by their HVoice (a token which is awarded for contributing to Hypha)
        li Hypha uses an 80/20 voting method where proposals are approved if they reach both 80% unity (approval of voting members) and 20% quorum (percentage of total voting power)
        li Proposals that are not approved can be modified and resubmitted based on feedback
      .text-body2 You can learn more about the Hypha organization below!
      .row.q-mt-md.q-mb-xl
        q-btn.q-px-lg(rounded color="primary" :to="{ path: '/bm/organization' }") Discover
        q-btn.q-px-lg.q-ml-md(rounded outline color="primary") Documentation
  // .row.q-col-gutter-md
    .col-3
      q-btn.fit(:to="{ path: '/bm/videos' }" rounded unelevated color="white" size="0.9em")
        .column.items-center.q-py-md
          q-icon.q-pa-md(color="primary" size="lg" name="fab fa-youtube")
          .item-subtitle2.text-no-wrap.text-primary Videos
    .col-3
      q-btn.fit(:to="{ path: '/bm/wiki' }" rounded unelevated color="white" size="0.9em")
        .column.items-center.q-py-md
          q-icon.q-pa-md(color="primary" size="lg" name="far fa-file-alt")
          .item-subtitle2.text-no-wrap.text-primary Wiki
    .col-3
      q-btn.fit(:to="{ path: '/bm/support' }" rounded unelevated color="white" size="0.9em")
        .column.items-center.q-py-md
          q-icon.q-pa-md(color="primary" size="lg" name="far fa-question-circle")
          .item-subtitle2.text-no-wrap.text-primary Support
    .col-3
      q-btn.fit(:to="{ path: '/bm/archetypes' }" rounded unelevated color="white" size="0.9em")
        .column.items-center.q-py-md
          q-icon.q-pa-md(color="primary" size="lg" name="far fa-user")
          .item-subtitle2.text-no-wrap.text-primary Archetypes
  .row.full-width.q-my-md
    .col-9
      widget(title="News")
        .text-subtitle1 Support for Multiple DHOs!
        .text-caption 15 Aug 2021
        .text-body2 We've released a huge update that greatly streamlines and simplifies blah blah blah this is a lot of news type, we want to have lots of strings for people to read with useful information just for fun. Eventually maybe this can be driven by admin settings?
    .col-3.q-pl-md
      widget(title="Last Week")
        .text-body2 14 proposals approved
        .text-caption.q-pl-sm 11 contributions
        .text-caption.q-pl-sm 3 assignments
        .text-body2 2 proposals rejected
        .text-body2 6 new members
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

<script>
/**
 * The banner which displays how voting works
 */
import { mapGetters } from 'vuex'
export default {
  name: 'proposal-banner',
  components: {
    ButtonRadio: () => import('~/components/common/button-radio.vue')
  },
  props: {
    isMember: Boolean
  },
  computed: {
    ...mapGetters('dao', ['selectedDao'])
  }
}
</script>

<template lang="pug">
.proposal-banner.full-width.bg-primary
  .q-pa-xl
    .row
      .col-6
        .column.justify-between
          .text-white
            span.h2.text-white.q-mb-lg Every vote
            span.h1.text-white.on-right counts
          .text-white.text-body2.q-my-lg Decentralized decision making is a new kind of governance framework that ensures that decisions are open, just and equitable for all participants. In the DHO we use the 80/20 voting method as well as HVOICE, our token that determines your voting power. Votes are open for 7 days.
          .row.q-gutter-sm
            q-btn.q-px-lg.h7(color="secondary" no-caps unelevated rounded label="Create proposal", :to="{ name: 'proposal-create', params: { dhoname: selectedDao.name } }" :disable="!isMember")
            q-btn.h7(color="white" no-caps flat rounded label="Learn more")
      .col-3.q-pa-sm
        button-radio(
          icon="fas fa-vote-yea"
          title="Unity"
          subtitle="80% min"
          description="Of all votes cast on a proposal, at least 80% must be in favor for a proposal to pass"
        )
      .col-3.q-pa-sm
        button-radio(
          icon="fas fa-users"
          title="Quorum"
          subtitle="20% min"
          description="The minimum % of the total vote supply that must be cast for a proposal to be considered"
        )
</template>

<style lang="stylus" scoped>
.proposal-banner
  border-radius 32px
  height 300px
</style>

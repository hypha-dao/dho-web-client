<script>
import { mapMutations } from 'vuex'
import MarkdownDisplay from '~/components/form/markdown-display'

export default {
  name: 'payout-view',
  components: { MarkdownDisplay },
  props: {
    payout: { type: Object }
  },
  computed: {
    owner () {
      const data = this.payout.names.find(o => o.key === 'owner')
      return (data && data.value) || ''
    },
    title () {
      const data = this.payout.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      const data = this.payout.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    hvoice () {
      const obj = this.payout.assets.find(o => o.key === 'hvoice_amount')
      return obj && obj.value
    },
    hypha () {
      const obj = this.payout.assets.find(o => o.key === 'hypha_amount')
      return obj && obj.value
    },
    seeds () {
      const obj = this.payout.assets.find(o => o.key === 'seeds_amount')
      return obj && obj.value
    },
    recipient () {
      const obj = this.payout.names.find(o => o.key === 'recipient')
      return obj && obj.value
    },
    contributedAt () {
      const obj = this.payout.time_points.find(o => o.key === 'contribution_date')
      return obj && obj.value
    },
    instantPay () {
      const obj = this.payout.ints.find(o => o.key === 'bypass_escrow')
      return obj && obj.value === 1
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    },
    open (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ title }}
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm
    legend Payout amounts
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hypha"
          outlined
          dense
          readonly
        )
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="hvoice"
          outlined
          dense
          readonly
        )
      .col-6
        q-input.bg-grey-4.text-black(
          v-model="ftCapacity"
          outlined
          dense
          readonly
        )
        .hint FT capacity
      .col-3(:style="{width:'40%'}")
        q-input.bg-grey-4.text-black(
          v-model="usdEquity"
          outlined
          dense
          readonly
        )
        .hint Usd equivalent/year
  fieldset.q-mt-sm
    legend Lunar cycles
    p This is the  lunar start and re-evaluation date for this role, followed by the number of lunar cycles.
    .row.q-col-gutter-xs
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="startPhase && new Date(startPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(startPhase && startPhase.phase)")
      .col-5(:style="{width:'39%'}")
        q-input.bg-grey-4.text-black(
          v-model="endPhase && new Date(endPhase.start_date).toLocaleDateString()"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(:name="getIcon(endPhase && endPhase.phase)")
      .col-2(:style="{width:'22%'}")
        q-input.bg-grey-4.text-black(
          v-model="cycle"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(name="fas fa-hashtag")
  .row.flex.justify-between.q-mt-md
    q-btn(
      label="Close"
      rounded
      color="grey"
      unelevated
      @click="hide"
    )
</template>

<style lang="stylus" scoped>
fieldset
  border-radius 4px
  border 1px solid rgba(0,0,0,.24)
  legend
    text-transform uppercase
    font-size 12px
  p
    font-size 12px
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
.vote-bar
  opacity 1
.vote-text
  font-weight 600
.proposal-actions
  button
    width 100px
</style>

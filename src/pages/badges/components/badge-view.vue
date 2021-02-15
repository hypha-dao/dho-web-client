<script>
import { mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import MarkdownDisplay from '~/components/form/markdown-display'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import VoteYesNoAbstain from '~/components/documents-parts/vote-yes-no-abstain'

export default {
  name: 'badge-view',
  mixins: [documents],
  components: { MarkdownDisplay, LunarCyclesDisplay, VoteYesNoAbstain },
  props: {
    badge: { type: Object }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    title () {
      return this.getValue(this.badge, 'details', 'title')
    },
    description () {
      return this.getValue(this.badge, 'details', 'description')
    },
    icon () {
      return this.getValue(this.badge, 'details', 'icon')
    },
    maxCycles () {
      return this.getValue(this.badge, 'details', 'max_cycles')
    },
    seeds () {
      return this.getValue(this.badge, 'details', 'seeds_coefficient_x10000') / 100
    },
    hypha () {
      return this.getValue(this.badge, 'details', 'hypha_coefficient_x10000') / 100
    },
    hvoice () {
      return this.getValue(this.badge, 'details', 'hvoice_coefficient_x10000') / 100
    },
    husd () {
      return this.getValue(this.badge, 'details', 'husd_coefficient_x10000') / 100
    },
    startPhase () {
      const id = this.getValue(this.badge, 'details', 'start_period')
      if (id) {
        return this.periods.find(p => p.period_id === id)
      }
      return null
    },
    endPhase () {
      const id = this.getValue(this.badge, 'details', 'end_period')
      if (id) {
        return this.periods.find(p => p.period_id === id)
      }
      return null
    },
    proposer () {
      return this.getValue(this.badge, 'system', 'proposer')
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    ...mapMutations('badges', ['removeProposal']),
    onClose () {
      this.removeProposal()
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  }
}
</script>

<template lang="pug">
.q-pa-xs
  .text-h6.q-mb-sm.q-ml-md {{ title }}
  .text-center
    q-img.avatar(
      v-if="icon"
      :src="icon"
    )
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
  fieldset.q-mt-sm
    legend Badge restrictions
    .row.q-col-gutter-sm
      .col-md-6.col-xs-12
        q-input(
          v-model="maxCycles"
          label="Max cycles"
          outlined
          dense
          readonly
        )
      .col-md-6.col-xs-12
        | This value determines the maximum amount of cycles a badge holder can apply for.
  fieldset.q-mt-sm
    legend Token coefficients
    p Badges are a token of appreciation and achievement but they don’t create value unless you apply them to a contribution or assignment. The value is calculated by multiplying a percentage for each token in the boxes below, with 100% equal to no change in the compensation.
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="seeds"
          type="number"
          outlined
          readonly
          dense
        )
          template(v-slot:append)
            q-icon(
              name="img:app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-liquid.text-black(
          v-model="husd"
          type="number"
          outlined
          readonly
          dense
        )
        .hint HUSD
      .col-6
        q-input.bg-liquid.text-black(
          v-model="hvoice"
          type="number"
          outlined
          readonly
          dense
        )
        .hint HVOICE
      .col-6
        q-input.bg-liquid.text-black(
          v-model="hypha"
          type="number"
          readonly
          outlined
          dense
        )
        .hint HYPHA
  lunar-cycles-display(
    :startPhase="startPhase"
    :endPhase="endPhase"
    text="This is the lunar start and re-evaluation date for this badge, followed by the number of lunar cycles. We recommend a maximum of 12 periods before reevaluation."
  )
  .row.flex.justify-start.q-mt-md
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
button
  width 30%
.avatar
  margin-top 20px
  width 100%
  max-width 150px
  height 150px
</style>

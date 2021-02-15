<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { documents } from '~/mixins/documents'
import { format } from '~/mixins/format'
import MarkdownDisplay from '~/components/form/markdown-display'
import LunarCyclesDisplay from '~/components/documents-parts/lunar-cycles-display'
import RawDisplayIcon from '~/components/documents-parts/raw-display-icon'

export default {
  name: 'assignment-view',
  mixins: [documents, format],
  components: { MarkdownDisplay, LunarCyclesDisplay, RawDisplayIcon },
  props: {
    assignment: { type: Object }
  },
  data () {
    return {
      role: null,
      monthly: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    roleId () {
      return this.getValue(this.assignment, 'details', 'role')
    },
    title () {
      return this.getValue(this.assignment, 'details', 'title')
    },
    description () {
      return this.getValue(this.assignment, 'details', 'description')
    },
    assignee () {
      return this.getValue(this.assignment, 'details', 'assignee')
    },
    url () {
      return this.getValue(this.assignment, 'details', 'url')
    },
    tokenHvoice () {
      const amount = parseFloat(this.getValue(this.assignment, 'details', 'hvoice_salary_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    tokenHusd () {
      const amount = parseFloat(this.getValue(this.assignment, 'details', 'husd_salary_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    tokenHypha () {
      const amount = parseFloat(this.getValue(this.assignment, 'details', 'hypha_salary_per_phase'))
      return this.toAsset(amount * (this.monthly ? 4 : 1) || 0)
    },
    salaryCommitted () {
      return this.getValue(this.assignment, 'details', 'time_share_x100')
    },
    usdEquity () {
      return this.role && this.getValue(this.role, 'details', 'annual_usd_salary')
    },
    salaryDeferred () {
      return this.getValue(this.assignment, 'details', 'deferred_perc_x100')
    },
    startPhase () {
      const period = this.getValue(this.assignment, 'details', 'start_period')
      if (period) {
        return this.periods.find(p => p.value === period)
      }
      return null
    },
    periodCount () {
      return this.getValue(this.assignment, 'details', 'period_count')
    }
  },
  methods: {
    ...mapActions('roles', ['loadRole']),
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    onClose () {
      this.hide()
    },
    hide () {
      this.setShowRightSidebar(false)
      this.setRightSidebarType(null)
    }
  },
  watch: {
    roleId: {
      immediate: true,
      async handler (val) {
        this.role = val && await this.loadRole(val)
      }
    }
  }
}
</script>

<template lang="pug">
  .q-pa-xs
    .text-h6.q-mb-sm.q-ml-md
      | {{ title }}
      raw-display-icon(:document="assignment")
    .description.relative-position(
      v-if="description"
    )
      markdown-display(:text="description")
    fieldset.q-mt-sm(v-if="url")
      legend Supporting documentation
      a.link.q-my-md(:href="url" target="_blank") {{ url | truncate(60) }}
    fieldset.q-mt-sm
      legend Salary
      p Fields below display the payout of this assignment for a {{ this.monthly ? 'full lunar cycle (ca. 1 month)' : 'single lunar period (ca. 1 week)' }} as well as % committed and % deferred. The payout is shown as USD equivalent and the corresponding amounts in SEEDS, HVOICE, HYPHA and HUSD.
      .row.q-col-gutter-xs
        .col-xs-12.col-md-6
          q-input.bg-grey-4.text-black(
            v-model="salaryCommitted"
            outlined
            dense
            readonly
          )
          .hint Committed
        .col-xs-12.col-md-6
          q-input.bg-grey-4.text-black(
            v-model="salaryDeferred"
            outlined
            dense
            readonly
          )
          .hint Deferred
      .row.q-my-sm
        strong SALARY CALCULATION (BASED ON USD EQUIVALENT OF USD {{ usdEquity }})
      .row.q-col-gutter-xs
        .col-4
          q-input.bg-liquid.text-black(
            v-model="tokenHusd"
            outlined
            dense
            readonly
          )
          .hint HUSD
        .col-4
          q-input.bg-liquid.text-black(
            v-model="tokenHvoice"
            outlined
            dense
            readonly
          )
          .hint HVOICE
        .col-4
          q-input.bg-liquid.text-black(
            v-model="tokenHypha"
            outlined
            dense
            readonly
          )
          .hint HYPHA
      .row
        q-toggle(v-model="monthly" label="Show tokens for a full lunar cycle (ca. 1 month)")
    lunar-cycles-display(
      :startPhase="startPhase"
      :periodCount="periodCount"
      text="This is the lunar start date and periods for this assignment. We recommend a maximum of 12 periods before reevaluation."
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

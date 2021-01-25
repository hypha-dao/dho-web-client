<script>
import { mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import { format } from '~/mixins/format'
import MarkdownDisplay from '~/components/form/markdown-display'
import RawDisplayIcon from '~/components/form/raw-display-icon'

export default {
  name: 'assignment-view',
  mixins: [forms, validation, format],
  components: { MarkdownDisplay, RawDisplayIcon },
  props: {
    data: { type: Object }
  },
  data () {
    return {
      isFullScreen: false,
      submitting: false,
      monthly: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
    ...mapGetters('payouts', ['seedsToUsd']),
    title () {
      if (!this.data.role) return ''
      const data = this.data.role.strings.find(o => o.key === 'title')
      return (data && data.value) || ''
    },
    description () {
      if (!this.data.assignment) return ''
      const data = this.data.assignment.strings.find(o => o.key === 'description')
      return (data && data.value) || ''
    },
    url () {
      if (!this.data.assignment) return ''
      const data = this.data.assignment.strings.find(o => o.key === 'url')
      return (data && data.value !== 'null' && data.value) || null
    },
    usdEquity () {
      if (!this.data.role) return ''
      const data = this.data.role.assets.find(o => o.key === 'annual_usd_salary')
      return this.toAsset(data && data.value && parseFloat(data.value))
    },
    salaryCommitted () {
      const data = this.data.assignment.ints.find(o => o.key === 'time_share_x100')
      return (data && !isNaN(data.value) && `${(data.value).toFixed(0)}%`) || ''
    },
    salaryDeferred () {
      const data = this.data.assignment.ints.find(o => o.key === 'deferred_perc_x100')
      return (data && !isNaN(data.value) && `${(data.value).toFixed(0)}%`) || ''
    },
    startPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    tokenHvoice () {
      const data = this.data.assignment.assets.find(o => o.key === 'hvoice_salary_per_phase')
      return this.toAsset((data && parseFloat(data.value) * (this.monthly ? 4 : 1)) || 0)
    },
    tokenHusd () {
      const data = this.data.assignment.assets.find(o => o.key === 'husd_salary_per_phase')
      return this.toAsset((data && parseFloat(data.value)) * (this.monthly ? 4 : 1) || 0)
    },
    tokenHypha () {
      const data = this.data.assignment.assets.find(o => o.key === 'hypha_salary_per_phase')
      return this.toAsset((data && parseFloat(data.value)) * (this.monthly ? 4 : 1) || 0)
    },
    endPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    cycle () {
      if (!this.endPhase) return ''
      return (this.endPhase.period_id - this.startPhase.period_id) / 4
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    getIcon (phase) {
      switch (phase) {
        case 'First Quarter':
          return 'fas fa-adjust'
        case 'Full Moon':
          return 'far fa-circle'
        case 'Last Quarter':
          return 'fas fa-adjust reversed'
        case 'New Moon':
          return 'fas fa-circle'
        default:
          return 'fas fa-circle'
      }
    },
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
  .text-h6.q-mb-sm.q-ml-md
    | {{ title }}
    raw-display-icon(
      :object="data.assignment"
      scope="assignment"
      :id="data.assignment.id"
    )
  .description.relative-position(
    v-if="description"
  )
    markdown-display(:text="description")
    q-btn.absolute-bottom-right.q-ma-xs(
      v-if="url"
      color="grey-8"
      flat
      dense
      icon="fas fa-link"
      @click="open(url)"
      size="sm"
    )
  fieldset.q-mt-sm
    legend Salary
    p Fields below display the payout of this assignment for a {{ this.monthly ? 'full lunar cycle (ca. 1 month)' : 'single lunar period (ca. 1 week)' }} as well as % committed and % HYPHA tokens vs. HUSD tokens. The payout is shown as USD equivalent and the corresponding amounts in HVOICE, HYPHA and HUSD.
    .row.q-col-gutter-xs.q-mb-md
      .col-xs-12.col-md-6
        q-input.bg-grey-4.text-black(
          v-model="salaryCommitted"
          label="Committed"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
      .col-xs-12.col-md-6
        q-input.bg-grey-4.text-black(
          v-model="salaryDeferred"
          label="Deferred"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
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
        .hint husd
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-4
        q-input.bg-liquid.text-black(
          v-model="tokenHypha"
          outlined
          dense
          readonly
        )
        .hint hypha
    .row
      q-toggle(v-model="monthly" label="Show tokens for a full lunar cycle (ca. 1 month)")
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
.title
  font-size 20px
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
.hint
  margin-top 2px
  text-transform uppercase
  font-size 12px
</style>

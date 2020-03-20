<script>
import { mapGetters, mapMutations } from 'vuex'
import { validation } from '~/mixins/validation'
import { forms } from '~/mixins/forms'
import MarkdownDisplay from '~/components/form/markdown-display'

export default {
  name: 'assignment-view',
  mixins: [forms, validation],
  components: { MarkdownDisplay },
  props: {
    data: { type: Object }
  },
  data () {
    return {
      display: {
        deferredSeeds: 0,
        liquidSeeds: 0,
        hvoice: 0,
        hypha: 0,
        husd: 0
      },
      isFullScreen: false,
      submitting: false
    }
  },
  computed: {
    ...mapGetters('periods', ['periods']),
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
      return (data && data.value && parseFloat(data.value).toFixed(2)) || ''
    },
    salaryCommitted () {
      const data = this.data.assignment.ints.find(o => o.key === 'time_share_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    salaryDeferred () {
      const data = this.data.assignment.ints.find(o => o.key === 'deferred_perc_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    salaryInstantHUsd () {
      const data = this.data.assignment.ints.find(o => o.key === 'instant_husd_perc_x100')
      return (data && data.value && `${(data.value).toFixed(2)}%`) || ''
    },
    startPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'start_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    endPhase () {
      const obj = this.data.assignment.ints.find(o => o.key === 'end_period')
      if (obj) {
        return this.periods.find(p => p.period_id === obj.value)
      }
      return null
    },
    cycle () {
      return (this.endPhase.period_id - this.startPhase.period_id) / 4
    }
  },
  methods: {
    ...mapMutations('layout', ['setShowRightSidebar', 'setRightSidebarType']),
    computeTokens (committed, deferred, instant) {
      const committedSan = isNaN(committed) ? 0 : parseFloat(committed || 0)
      const deferredSan = isNaN(deferred) ? 0 : parseFloat(deferred || 0)
      const instantSan = isNaN(instant) ? 0 : parseFloat(instant || 0)
      const ratioUsdEquity = parseFloat(this.usdEquity) * committedSan / 100
      this.display.hvoice = (2 * ratioUsdEquity).toFixed(2)
      this.display.deferredSeeds = (ratioUsdEquity * deferredSan / 100 * (1.3 / 0.01) + (ratioUsdEquity * (1 - deferredSan / 100)) / 0.01).toFixed(4)
      this.display.hypha = (ratioUsdEquity * deferredSan / 100 * 0.6).toFixed(2)
      this.display.husd = (ratioUsdEquity * (1 - deferredSan / 100) * (instantSan / 100)).toFixed(2)
      this.display.liquidSeeds = (ratioUsdEquity * (1 - deferredSan / 100) * (1 - instantSan / 100)).toFixed(2)
    },
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
  },
  watch: {
    data: {
      immediate: true,
      handler () {
        this.computeTokens(
          parseFloat(this.salaryCommitted),
          parseFloat(this.salaryDeferred),
          parseFloat(this.salaryInstantHUsd)
        )
      }
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
    p Please enter your % commitment and % deferral for this role. The more you defer to a later date, the higher the bonus will be (see actual salary calculation below).
    .row.q-col-gutter-xs.q-mb-md
      .col-xs-12.col-md-4
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
      .col-xs-12.col-md-4
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
      .col-xs-12.col-md-4
        q-input.bg-grey-4.text-black(
          v-model="salaryInstantHUsd"
          label="HUSD"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="fas fa-percentage"
              size="xs"
            )
    .row.q-col-gutter-xs
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.deferredSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Deferred Seeds
      .col-6
        q-input.bg-seeds.text-black(
          v-model="display.liquidSeeds"
          outlined
          dense
          readonly
        )
          template(v-slot:append)
            q-icon(
              name="img:statics/app/icons/seeds.png"
              size="xs"
            )
        .hint Liquid Seeds
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hvoice"
          outlined
          dense
          readonly
        )
        .hint hvoice
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.hypha"
          outlined
          dense
          readonly
        )
        .hint hypha
      .col-4
        q-input.bg-liquid.text-black(
          v-model="display.husd"
          outlined
          dense
          readonly
        )
        .hint husd
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

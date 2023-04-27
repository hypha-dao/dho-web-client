<script>
const TABS = Object.freeze({
  STRUCTURE: 'STRUCTURE',
  DISTRIBUTION: 'DISTRIBUTION'
})

function percentage (partialValue, totalValue) {
  if (partialValue === 0 || totalValue === 0) {
    return 0
  }
  return (100 * partialValue) / totalValue
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US').format(parseInt(amount), { style: 'currency' })
}

export default {
  name: 'circles-widget',
  components: {
    CircleCard: () => import('./circle-card.vue'),
    Widget: () => import('../common/widget.vue')
  },
  props: {
    title: {
      type: String,
      default: 'Circles'
    },
    circles: {
      type: Array,
      default: () => []
    },
    singleCircle: Boolean
  },

  data () {
    return {
      TABS,
      tab: TABS.STRUCTURE
    }
  },

  computed: {
    totalBudget () { return this.circles.reduce((total, circle) => total + Number(circle.husd.length ? circle.husd[0] : 0), 0) }
  },

  methods: {
    formatCurrency,
    percentage
  }
}
</script>

<template lang="pug">
widget(:title="singleCircle ? '' : title" :noPadding="singleCircle").full-height.full-width
  template(v-if="!singleCircle")
    .h-h3.text-secondary.absolute(:style="{ 'top': '0', 'right': '0' }") {{ circles.length }}
    q-tabs(
      active-color="primary"
      align="start"
      indicator-color="primary"
      no-caps
      v-model="tab"
      v-if="circles.length > 0"
    )
      q-tab(:name="TABS.STRUCTURE" label="Structure" :ripple="false")
      q-tab(:name="TABS.DISTRIBUTION" label="Circle Budget Distribution" :ripple="false")
    div(v-if="tab === TABS.STRUCTURE")
      template(v-for="circle in circles")
        circle-card(v-bind="circle")
    div(v-if="tab === TABS.DISTRIBUTION")
      template(v-for="circle in circles")
        widget.bg-internal-bg.q-my-md.cursor-pointer(:style="{ 'padding-right': '10px' }")
          div(:style="{ 'padding-right': '20px' }")
            .row.items-center.justify-between
              .row.items-center
                .h-h4.q-mr-md {{ circle.name }}
                .row
                  .text-black.text-bold.text-xs.text-italic.q-mr-xs TOTAL:
                  .text-italic.text-xs $ {{ formatCurrency(totalBudget ? totalBudget : 0) }}
              .row.items-center
                .row.items-center.flex
                  .husd-label
                  .text-black.text-bold.text-xs.text-italic.q-ml-xxs HUSD
                .row.items-center.flex.q-ml-md
                  .hypha-label
                  .text-black.text-bold.text-xs.text-italic.q-ml-xxs HYPHA
            .row.no-wrap
              q-linear-progress.q-mt-xs(rounded size="8px" color="primary" :value="percentage(circle.husd[0] ? circle.husd[0] : 0,totalBudget)/100")
              .text-italic.text-xs.q-mt-xxs.q-ml-md {{ formatCurrency(circle.husd[0] ? circle.husd[0] : 0) }}
            .row.no-wrap
              q-linear-progress.q-mt-xs(rounded size="8px" color="secondary" :value="percentage(circle.hvoice[0] ? circle.hvoice[0] : 0,totalBudget)/100")
              .text-italic.text-xs.q-mt-xxs.q-ml-md {{ formatCurrency(circle.hvoice[0] ? circle.hvoice[0] : 0) }}
          .row.q-my-md.items-center.q-pr-md(v-if="circle.subcircles.length" :style=" { 'flex-wrap': 'nowrap', 'white-space': 'nowrap' }")
            .text-black.text-bold.text-italic.text-xs.q-mr-xs Budget Breakdown
            .separator
          .row
            .template.col-6.q-pr-md.q-pb-md(v-for="subCircle in circle.subcircles" :style="{ 'padding-right': '20px' }" :class=" { 'full-width': $q.screen.lt.md }")
              widget
                .row.items-center
                  .h-h6 {{ subCircle.name }}
                .row.no-wrap
                  q-linear-progress.q-mt-xs(rounded size="8px" color="primary" :value="percentage(subCircle.husd[0] ? subCircle.husd[0] : 0,circle.husd[0] ? circle.husd[0] : 0)/100")
                  .text-italic.text-xs.q-mt-xxs.q-ml-md {{ formatCurrency(subCircle.husd[0] ? subCircle.husd[0] : 0) }}
                .row.no-wrap
                  q-linear-progress.q-mt-xs(rounded size="8px" color="secondary" :value="percentage(subCircle.hvoice[0] ? subCircle.hvoice[0] : 0,circle.hvoice[0] ? circle.hvoice[0] : 0)/100")
                  .text-italic.text-xs.q-mt-xxs.q-ml-md {{ formatCurrency(subCircle.hvoice[0] ? subCircle.hvoice[0] : 0) }}
  template(v-else)
    template(v-for="circle in circles")
      circle-card(v-bind="circle")
</template>
<styles lang="stylus" scoped>
.husd-label
  width: 12px
  height: 12px
  border-radius: 50%
  background: #3F64EE
.hypha-label
  width: 12px
  height: 12px
  border-radius: 50%
  background: #242F5D
.separator
  width: 100%
  height: 1px
  background: #707070
  display: block
  opacity: .5
</styles>

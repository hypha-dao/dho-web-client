<script>
const TABS = Object.freeze({
  STRUCTURE: 'STRUCTURE',
  DISTRIBUTION: 'DISTRIBUTION'
})

function percentage (partialValue, totalValue) {
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
    totalBudget () { return this.circles.reduce((total, circle) => total + Number(circle.budget), 0) }
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
      q-tab(:name="TABS.DISTRIBUTION" label="Distribution" :ripple="false")
    div(v-if="tab === TABS.STRUCTURE")
      template(v-for="circle in circles")
        circle-card(v-bind="circle")
    div(v-if="tab === TABS.DISTRIBUTION")
      template(v-for="circle in circles")
        widget.bg-internal-bg.q-my-md.cursor-pointer
          div
            .row.items-center
              .h-h4.q-mr-xl {{ circle.name }}
              .row
                .text-bold.text-xs.q-mr-xs Total:
                .text-italic.text-xs $ {{ formatCurrency(circle.budget) }}
            q-linear-progress.q-mt-xs(rounded size="8px" :value="percentage(circle.budget,totalBudget)/100")
          template(v-for="subCircle in circle.subcircles")
            .row.items-center.q-mt-md
                .h-h5.q-mr-xl {{ subCircle.name }}
                .row
                  .text-italic.text-xs $ {{ formatCurrency(subCircle.budget) }}
            q-linear-progress.q-mt-xs(rounded size="8px" color="secondary" :value="percentage(subCircle.budget,circle.budget)/100")
  template(v-else)
    template(v-for="circle in circles")
      circle-card(v-bind="circle")
</template>

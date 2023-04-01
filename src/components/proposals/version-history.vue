<script>
import { dateToStringShort } from '~/utils/TimeUtils'
export default {
  name: 'version-history',
  components: {},
  data () {
    return {}
  },
  props: {
    history: Array
  },
  computed: {
  },
  methods: {
    currentPeriod (date) {
      return new Date(date) > Date.now()
    },
    parsedDate (date) {
      return dateToStringShort(date)
    }
  }
}
</script>
<template lang="pug">
.version-history
  .h-h7.q-mb-md Version History
  .row
    template(v-for="card in history")
      div.bg-internal-bg.q-mr-md.q-mb-md.rounded-border.q-pa-md(:style="{ 'min-width': '160px' }" :class="{ 'selected-card': currentPeriod(card.date) }")
        div(:style="{ 'border-radius': '50%', 'background': '#242F5D', 'width': '30px', 'height': '30px', 'display': 'flex' }" :class="{ 'selected-icon': currentPeriod(card.date) }")
        .h-h5.text-weight-700.q-mt-sm.q-mb-md(:class="{ 'selected-title': currentPeriod(card.date) }") {{ card.title }}
        div(v-if="currentPeriod(card.date)") Current - on voting
        div(v-else) {{ parsedDate(card.date) }}
</template>
<styles lang="stylus">
.rounded-border
  border-radius: 15px
.selected-icon
  background: #fff !important
.selected-card
  color: #fff !important
  background: #242F5D !important
.selected-title
  color: #fff !important
</styles>

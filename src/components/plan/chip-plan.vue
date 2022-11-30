<script>

export default {
  name: 'chip-plan',

  props: {
    plan: {
      type: String
    },

    daysLeft: {
      type: Number
    },

    graceDaysLeft: {
      type: Number
    },

    color: {
      type: String
    }
  },

  computed: {
    statusText () { return (this.daysLeft > 0 || this.plan === 'Founders') ? 'active' : (this.graceDaysLeft > 0 ? 'expired' : 'suspended') }
  }
}
</script>

<template lang="pug">
.row.text-white.rounded-full.q-px-xl.q-py-md(:class="[`bg-${color}`]")
  .row.full-width.items-center
      .q-pr-xl
        .h-h4.text-white {{plan}} plan
          span.h-h4.text-white.text-weight-500  {{statusText}}
      .q-px-xl(v-if="daysLeft && daysLeft > -1" :style="{'border-left': '2px solid rgba(255, 255, 255, .2)'}")
        .h-h4.text-white {{daysLeft}}
          span.text-xs.text-weight-500.q-pl-xxs days left
      .q-px-xl(v-else-if="graceDaysLeft && graceDaysLeft > 0" :style="{'border-left': '2px solid rgba(255, 255, 255, .2)'}")
        .h-h4.text-white {{graceDaysLeft}}
          span.text-xs.text-weight-500.q-pl-xxs days left to renew your plan
      .q-pl-xl.row.items-center(:style="{'border-left': '2px solid rgba(255, 255, 255, .2)'}")
          slot(name="cta")

</template>

<style lang="stylus" scoped>
</style>

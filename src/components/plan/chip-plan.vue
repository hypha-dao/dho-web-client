<script>

export default {
  name: 'chip-plan',
  components: {
  },

  props: {
    plan: {
      type: String,
      default: 'FREE'
    },

    daysLeft: {
      type: Number
    }
  },
  computed: {
  }
}
</script>

<template lang="pug">
.bg-secondary.text-white.rounded-full.q-px-xl.q-py-md.row
    .row.full-width.items-center
        .q-pr-xl
          .h-h4.text-white {{plan}} plan
            span.h-h4.text-white.text-weight-500  active
        .q-px-xl(v-if="daysLeft && daysLeft > -1" :style="{'border-left': '2px solid rgba(255, 255, 255, .2)'}")
          .h-h4.text-white {{daysLeft}}
            span.text-xs.text-weight-500.q-pl-xxs days left
        .q-pl-xl.row.items-center(:style="{'border-left': '2px solid rgba(255, 255, 255, .2)'}")
            slot(name="cta")

</template>

<style lang="stylus" scoped>
</style>

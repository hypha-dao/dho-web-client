<script>
export default {
  name: 'top-icon',
  props: {
    type: { type: String }
  }
}
</script>

<template lang="pug">
div
  img.icon(v-if="type === 'assignment'" src="~assets/icons/assignments.svg")
  img.icon(v-if="type === 'badge'" src="~assets/icons/badge.svg")
  img.icon(v-if="type === 'payout'" src="~assets/icons/past.svg")
  img.icon(v-if="type === 'role'" src="~assets/icons/roles.svg")
</template>

<style lang="stylus" scoped>
.icon
  position absolute
  right 30px
  top 10px
  width 40px
</style>

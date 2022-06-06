<script>
export default {
  name: 'top-icon',
  props: {
    type: { type: String },
    menu: { type: Boolean }
  }
}
</script>

<template lang="pug">
div
  img.icon(v-if="type === 'assignment'" src="~assets/icons/assignments.svg" :class="{ 'with-menu': menu }")
  img.icon(v-if="type === 'badge'" src="~assets/icons/badge.svg" :class="{ 'with-menu': menu }")
  img.icon(v-if="type === 'payout'" src="~assets/icons/past.svg" :class="{ 'with-menu': menu }")
  img.icon(v-if="type === 'role'" src="~assets/icons/roles.svg" :class="{ 'with-menu': menu }")
</template>

<style lang="stylus" scoped>
.icon
  position absolute
  right 10px
  top 10px
  width 40px
.with-menu
  right 40px
</style>

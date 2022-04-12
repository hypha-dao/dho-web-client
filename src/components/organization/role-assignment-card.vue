<template lang="pug">
widget.bg-internal-bg.q-my-xxs.cursor-pointer(noPadding)
  .row.items-center.content(:style="cssVars")
    .col
      .row.flex.items-center
        .h-h5.one-line {{ title }}
    template(v-if="!compact")
      .col
        .h-b2.text-weight-thin.text-body  {{description.substr(0,150) + (description.length > 150 ? '...' : '')}}
</template>

<script>
export default {
  name: 'role-assignment-card',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    /**
     * Circle Title
     */
    title: String,
    /**
     * Circle Description
     */
    description: String,
    /**
     * Show compact style
     */
    compact: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cssVars () {
      return {
        '--card-height': this.compact ? '70px' : '90px',
        '--card-ml': this.compact ? '20px' : '30px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.content
  height var(--card-height)
  margin-left var(--card-ml)
  overflow hidden
</style>

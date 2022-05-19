<template lang="pug">
widget.bg-internal-bg.q-my-xxs.cursor-pointer(noPadding)
  .row.items-center.content(:style="cssVars")
    .col
      .row.flex.items-center
        q-avatar(size="md" v-if="icon && !icon.includes('icon:')")
          img(:src="icon")
        q-btn(v-if="icon && icon.includes('icon:')" round unelevated :icon="icon.replace('icon:', '')" color="primary" text-color="white" size="10px" :ripple="false")
        .h-h5.q-ml-xl.one-line(:class="{ 'q-ml-md': !compact, 'h-h7': compact }") {{ title }}
    template(v-if="!compact")
      .col
        .h-b2.text-weight-thin.text-body.q-mr-xl.break-word {{description.substr(0,150) + (description.length > 150 ? '...' : '')}}
</template>

<script>
export default {
  name: 'badge-assignment-card',
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
    },
    icon: String
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

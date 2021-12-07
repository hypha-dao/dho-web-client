<script>
export default {
  name: 'circle-card',
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
     * Circle Icon
     */
    icon: String
  },
  data () {
    return {
    }
  }
}
</script>

<template lang="pug">
  widget.bg-grey-4.q-ma-xs.cursor-pointer
    q-btn(round unelevated :icon="icon" color="primary" text-color="white" size="sm" :ripple="false")
    .text-h6 {{title}}
    .text-body2.q-mt-sm.text-weight-thin.text-grey-7  {{description}}
</template>

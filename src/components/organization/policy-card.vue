<script>
export default {
  name: 'policy-card',
  components: {
    Widget: () => import('../common/widget.vue')
  },
  props: {
    /**
     * Policy Title
     */
    title: String,
    /**
     * Policy Description
     */
    description: String
  }
}
</script>

<template lang="pug">
  widget.bg-internal-bg.q-my-xs
    .text-body2.text-weight-bold.q-mb-xs {{title}}
    .text-body2.text-weight-thin {{description}}
</template>

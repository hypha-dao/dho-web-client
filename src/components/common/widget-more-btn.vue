<script>
/**
 * A component to display a see more button on the widgets
 */
export default {
  name: 'widget-more-btn',
  components: {
    LoadingSpinner: () => import('~/components/common/loading-spinner.vue')
  },
  props: {
  },
  data () {
    return {
      loading: false,
      completed: false
    }
  },
  methods: {
    onMore () {
      if (this.loading || this.completed) {
        return
      }
      this.loading = true
      this.$emit('onMore', this.onLoadResult)
    },
    onLoadResult (result) {
      this.completed = result
      setTimeout(() => {
        this.loading = false
      }, 500) // Just so users dont click it too often
    }
  }
}
</script>

<template lang="pug">
.row
  q-btn.q-pa-xxs(
    flat size="12px"
    rounded
    color="primary"
    no-caps
    label="See more"
    v-if="!completed && !loading"
    @click="onMore")
  loading-spinner.q-pa-xxs(
    color="primary"
    size="40px"
    v-if="loading"
  )
</template>

<style lang="stylus" scoped>

</style>

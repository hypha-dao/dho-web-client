<script>
export default {
  name: 'widget-more-btn',
  components: {
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
      setTimeout(() => {
        this.loading = false
        this.completed = result
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
  q-spinner-dots.q-pa-xxs(
    color="primary"
    size="40px"
    v-if="loading"
  )
</template>

<style lang="stylus" scoped>

</style>

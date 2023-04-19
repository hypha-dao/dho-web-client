<script lang="ts">
import { defineComponent } from 'vue'
import LoadingSpinner from '~/components/common/loading-spinner.vue'
/**
 * A component to display a see more button on the widgets
 */
export default defineComponent({
  name: 'widget-more-btn',
  components: {
    LoadingSpinner
  },
  props: {},
  data() {
    return {
      loading: false,
      completed: false
    }
  },
  methods: {
    onMore() {
      if (this.loading || this.completed) {
        return
      }
      this.loading = true
      this.$emit('onMore', this.onLoadResult)
    },
    onLoadResult(result) {
      this.completed = result
      setTimeout(() => {
        this.loading = false
      }, 500) // Just so users dont click it too often
    }
  }
})
</script>

<template lang="pug">
.row
  q-btn.q-pa-xxs(
    @click="onMore"
    color="primary"
    flat
    label="See more"
    no-caps
    rounded
    size="12px"
    v-if="!completed && !loading"
  )
  loading-spinner.q-pa-xxs(
    color="primary"
    size="40px"
    v-if="loading"
  )
</template>

<style lang="stylus" scoped></style>

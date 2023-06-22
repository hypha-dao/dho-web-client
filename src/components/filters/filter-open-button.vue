<script>
export default {
  name: 'filter-open-button',
  components: {
  },

  props: {

  }
}
</script>

<template lang="pug">
.container
  q-btn(round="round" color="primary" text-color="white" rounded="rounded" unelevated="unelevated" size="sm" padding="25px" icon="fas fa-filter" @click="$emit('open')")
</template>

<style lang="stylus" scoped>
.container
  position: fixed
  z-index: 500
  bottom: 80px
  right: 15px

</style>

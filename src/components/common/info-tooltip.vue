<script>
export default {
  name: 'info-tooltip',

  props: {
    tooltip: {
      type: String,
      default: undefined
    }
  }
}
</script>

<template lang="pug">
  q-icon(name="fas fa-info-circle" size="15px" color="body" class="q-ml-xs" v-if="tooltip")
    q-tooltip {{ tooltip }}
</template>

<style lang="stylus" scoped>

</style>

<script>
export default {
  name: 'icon-card',
  components: {
    Widget: () => import('~/components/common/widget.vue')
  },
  props: {
    name: String,
    size: String || Number,
    background: {
      type: String,
      default: 'bg-grey-3'
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    emitClick (name) {
      this.$emit('click', name)
    }
  }
  // TO DO - Dynamic height same the width
  //   async mounted () {
  //     await this.$nextTick()
  //     this.$nextTick().then(v => {
  //     })
  //   }
}
</script>

<template lang="pug">
widget.icon-container.cursor-pointer(ref="container" @click="emitClick" :class="background")
    q-icon.absolute-center.q-pa-lg(:name="name" :size="size" :color="color" @click="emitClick(name)")
</template>

<style lang="stylus" scoped>
.icon-container
    padding-top: 3vw
    padding-bottom: 3vw
</style>

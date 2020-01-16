<script>
export default {
  name: 'layout-footer',
  data () {
    return {
      urls: {
        hypha: 'https://app.asana.com/0/1155061375599610/list',
        docs: 'https://docs.hypha.earth'
      }
    }
  },
  methods: {
    open (type) {
      window.open(this.urls[type], '_blank')
    }
  }
}
</script>

<template lang="pug">
q-toolbar.bg-primary
  q-toolbar-title.flex.justify-end
    q-btn(
      color="white"
      label="PROJECT"
      flat
      icon="img:https://img.icons8.com/color/48/000000/project.png"
      @click="open('hypha')"
    )
    q-btn(
      color="white"
      label="Docs"
      flat
      icon="img:https://img.icons8.com/dusk/32/000000/info.png"
      @click="open('docs')"
    )
</template>

<style lang="stylus" scoped>

</style>

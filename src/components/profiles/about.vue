<script>
/**
 * Renders the provided bio in markdown on a widget.
 */
export default {
  name: 'about',
  components: {
    Widget: () => import('../common/widget.vue')
  },

  props: {
    bio: String
  }
}
</script>

<template lang="pug">
widget(title="About")
  q-markdown(:src="bio")
</template>

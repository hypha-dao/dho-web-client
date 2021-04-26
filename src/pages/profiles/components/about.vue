<script>
export default {
  name: 'about',
  components: {
    Widget: () => import('~/components/widget.vue')
  },

  props: {
    bio: String
  }
}
</script>

<template lang="pug">
Widget(bar title="About")
  q-markdown(:src="bio").q-px-md
</template>

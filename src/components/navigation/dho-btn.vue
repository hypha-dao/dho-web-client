<script>
export default {
  name: 'dho-btn',

  props: {
    name: String,
    icon: String
  },

  methods: {
    imgSrc (icon) {
      return require('~/assets/logos/' + icon)
    }
  }
}
</script>

<template lang="pug">
q-btn.q-ma-sm(round @click="$emit('click')")
  q-avatar(size="48px")
    img(:src="imgSrc(icon)")
  q-tooltip(
    anchor="center right"
    self="center left"
    :content-style="{ 'font-size': '1em' }"
  ) {{ name }}
</template>

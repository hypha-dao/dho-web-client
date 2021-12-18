<script>
export default {
  name: 'dho-btn',

  props: {
    name: String,
    title: String,
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
  q-avatar(v-if="icon" size="48px")
    img(:src="imgSrc(icon)")
  q-avatar(v-else
    color="secondary"
    text-color="white"
    size="48px"
  ) {{ name.slice(0, 2) }}
  q-tooltip(
    anchor="center right"
    self="center left"
    :content-style="{ 'font-size': '1em' }"
  ) {{ title }}
</template>

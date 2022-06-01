<script>
export default {
  name: 'dho-btn',
  components: {},
  props: {
    name: String,
    title: String,
    logo: String,
    disable: Boolean
  },
  methods: {
    ipfsy (cid) { return 'https://gateway.ipfs.io/ipfs/' + cid.replace(/:.*$/, '') }
  }
}
</script>

<template lang="pug">
.container
  .q-ma-sm.no-pointer-events(v-if="disable")
  q-btn.q-ma-sm(v-else round @click="$emit('click')")
    q-avatar(size="48px" font-size="24px" color="primary" text-color="white")
      span(v-show="!logo") {{ title && title[0] }}
      img(v-show="logo" :src="ipfsy(logo)")
    q-tooltip(
      v-if="!disable"
      anchor="center right"
      self="center left"
      :content-style="{ 'font-size': '1em' }"
    ) {{ title }}
</template>
